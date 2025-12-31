import { google } from 'googleapis';
import sharp from 'sharp';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config({ path: '.env.local' });

// Initialize OAuth2 client with refresh token
const getDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('GOOGLE_REFRESH_TOKEN is not set');
  }

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
};

const SUBFOLDERS = {
  original: 'original',
  thumbs: 'thumbs',
  small: 'small',
  medium: 'medium',
};

// Cache for subfolder IDs
const subfolderCache = new Map<string, string>();

// Get or create a subfolder in Google Drive
async function getOrCreateSubfolder(drive: any, parentFolderId: string, folderName: string): Promise<string> {
  const cacheKey = `${parentFolderId}_${folderName}`;
  
  if (subfolderCache.has(cacheKey)) {
    return subfolderCache.get(cacheKey)!;
  }

  const searchResponse = await drive.files.list({
    q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 1,
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    const folderId = searchResponse.data.files[0].id!;
    subfolderCache.set(cacheKey, folderId);
    return folderId;
  }

  const createResponse = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  });

  const folderId = createResponse.data.id!;
  subfolderCache.set(cacheKey, folderId);
  return folderId;
}

// Download file from Google Drive
async function downloadFile(drive: any, fileId: string): Promise<Buffer> {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    response.data.on('data', (chunk: Buffer) => chunks.push(chunk));
    response.data.on('end', () => resolve(Buffer.concat(chunks)));
    response.data.on('error', reject);
  });
}

// Generate image variants using sharp
async function generateImageVariants(buffer: Buffer, fileName: string) {
  const baseName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
  const ext = fileName.split('.').pop() || 'jpg';

  // Generate variants
  const thumb = await sharp(buffer)
    .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const small = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  const medium = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toBuffer();

  return {
    original: { buffer, name: `${baseName}.${ext}` },
    thumb: { buffer: thumb, name: `${baseName}_thumb.jpg` },
    small: { buffer: small, name: `${baseName}_small.jpg` },
    medium: { buffer: medium, name: `${baseName}_med.jpg` },
  };
}

// Upload buffer to Google Drive
async function uploadBufferToDrive(
  drive: any,
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
) {
  const bufferStream = Readable.from(buffer);
  
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: mimeType,
    },
    media: {
      mimeType: mimeType,
      body: bufferStream,
    },
    fields: 'id, name',
  });

  // Make publicly accessible
  if (response.data.id) {
    try {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permError) {
      console.warn('Could not set public permissions:', permError);
    }
  }

  return response.data;
}

// Move file to a folder
async function moveFile(drive: any, fileId: string, fromFolderId: string, toFolderId: string) {
  await drive.files.update({
    fileId: fileId,
    addParents: toFolderId,
    removeParents: fromFolderId,
    fields: 'id, parents',
  });
}

// Process a folder
async function processFolderImages(drive: any, folderId: string, folderName: string) {
  console.log(`\n========================================`);
  console.log(`Processing folder: ${folderName}`);
  console.log(`========================================\n`);

  // Get or create subfolders
  const originalFolderId = await getOrCreateSubfolder(drive, folderId, SUBFOLDERS.original);
  const thumbsFolderId = await getOrCreateSubfolder(drive, folderId, SUBFOLDERS.thumbs);
  const smallFolderId = await getOrCreateSubfolder(drive, folderId, SUBFOLDERS.small);
  const mediumFolderId = await getOrCreateSubfolder(drive, folderId, SUBFOLDERS.medium);

  console.log('✓ Subfolders created/found');

  // List all files in the main folder (not in subfolders)
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  const files = response.data.files || [];
  console.log(`\nFound ${files.length} files to process\n`);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const fileName = file.name!;
    const mimeType = file.mimeType!;
    const fileId = file.id!;

    // Skip if it's a folder
    if (mimeType === 'application/vnd.google-apps.folder') {
      console.log(`⊗ Skipping folder: ${fileName}`);
      skippedCount++;
      continue;
    }

    // Check if it's a video
    const isVideo = mimeType.startsWith('video/');

    if (isVideo) {
      console.log(`📹 Moving video to /original: ${fileName}`);
      try {
        await moveFile(drive, fileId, folderId, originalFolderId);
        processedCount++;
        console.log(`  ✓ Moved`);
      } catch (err) {
        console.error(`  ✗ Error moving video:`, err);
        errorCount++;
      }
      continue;
    }

    // Check if it's an image
    const isImage = mimeType.startsWith('image/');

    if (!isImage) {
      console.log(`⊗ Skipping non-media file: ${fileName} (${mimeType})`);
      skippedCount++;
      continue;
    }

    console.log(`🖼️  Processing image: ${fileName}`);

    try {
      // Download original
      console.log(`  ↓ Downloading...`);
      const buffer = await downloadFile(drive, fileId);
      
      // Generate variants
      console.log(`  ⚙️  Generating variants...`);
      const variants = await generateImageVariants(buffer, fileName);

      // Upload variants in parallel
      console.log(`  ↑ Uploading variants...`);
      await Promise.all([
        uploadBufferToDrive(drive, variants.thumb.buffer, variants.thumb.name, 'image/jpeg', thumbsFolderId),
        uploadBufferToDrive(drive, variants.small.buffer, variants.small.name, 'image/jpeg', smallFolderId),
        uploadBufferToDrive(drive, variants.medium.buffer, variants.medium.name, 'image/jpeg', mediumFolderId),
      ]);

      // Move original to /original folder
      console.log(`  📁 Moving original...`);
      await moveFile(drive, fileId, folderId, originalFolderId);

      processedCount++;
      console.log(`  ✓ Complete\n`);

    } catch (err) {
      console.error(`  ✗ Error processing image:`, err);
      errorCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Summary for ${folderName}:`);
  console.log(`  Processed: ${processedCount}`);
  console.log(`  Skipped: ${skippedCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

// Main function
async function main() {
  const drive = getDriveClient();

  const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

  console.log('\n🚀 Starting image variant generation...\n');

  // Process wedding media folder
  if (DRIVE_FOLDER_ID) {
    await processFolderImages(drive, DRIVE_FOLDER_ID, 'Wedding Media');
  } else {
    console.warn('⚠️  DRIVE_FOLDER_ID not set, skipping wedding media folder');
  }

  console.log('\n✅ Migration complete!\n');
}

// Run the script
main().catch(console.error);
