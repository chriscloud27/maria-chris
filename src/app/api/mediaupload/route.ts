import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import sharp from 'sharp';

// Initialize OAuth2 client with refresh token
const getDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set refresh token to automatically refresh access tokens
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('GOOGLE_REFRESH_TOKEN is not set. Please authenticate first by visiting /api/auth/google');
  }

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
};

const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

// Subfolder structure
const SUBFOLDERS = {
  original: 'original',
  thumbs: 'thumbs',
  small: 'small',
  medium: 'medium',
};

// Cache for subfolder IDs to avoid repeated lookups
const subfolderCache = new Map<string, string>();

// Get or create a subfolder in Google Drive
async function getOrCreateSubfolder(drive: any, parentFolderId: string, folderName: string): Promise<string> {
  const cacheKey = `${parentFolderId}_${folderName}`;
  
  if (subfolderCache.has(cacheKey)) {
    return subfolderCache.get(cacheKey)!;
  }

  // Check if folder exists
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

  // Create folder if it doesn't exist
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

// Generate image variants using sharp
async function generateImageVariants(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
  const ext = file.name.split('.').pop() || 'jpg';

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
    fields: 'id, name, webViewLink',
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

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_UPLOADS_PER_WINDOW = 50; // Increased to allow batch uploads

function checkRateLimit(ip: string, cost: number = 1): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: cost, lastReset: now });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: cost, lastReset: now });
    return true;
  }

  if (record.count + cost > MAX_UPLOADS_PER_WINDOW) {
    return false;
  }

  record.count += cost;
  return true;
}

// Helper to convert Web Stream to Node Readable Stream
function webStreamToNodeStream(webStream: ReadableStream<Uint8Array>): Readable {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!DRIVE_FOLDER_ID) {
      return NextResponse.json({ error: 'Server configuration error: DRIVE_FOLDER_ID missing' }, { status: 500 });
    }

    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, files.length)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const drive = getDriveClient();
    
    // Get or create subfolders
    const originalFolderId = await getOrCreateSubfolder(drive, DRIVE_FOLDER_ID, SUBFOLDERS.original);
    const thumbsFolderId = await getOrCreateSubfolder(drive, DRIVE_FOLDER_ID, SUBFOLDERS.thumbs);
    const smallFolderId = await getOrCreateSubfolder(drive, DRIVE_FOLDER_ID, SUBFOLDERS.small);
    const mediumFolderId = await getOrCreateSubfolder(drive, DRIVE_FOLDER_ID, SUBFOLDERS.medium);

    const results = [];
    const errors = [];

    for (const file of files) {
      // Validation
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: Size exceeds 10MB limit`);
        continue;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        continue;
      }

      try {
        const isVideo = file.type.startsWith('video/');
        
        if (isVideo) {
          // Upload videos only to original folder
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const result = await uploadBufferToDrive(drive, buffer, file.name, file.type, originalFolderId);
          
          results.push({
            id: result.id,
            name: result.name,
            mimeType: file.type,
            variants: {
              original: result.id,
            },
          });
        } else {
          // Generate and upload image variants
          const variants = await generateImageVariants(file);
          
          const [originalResult, thumbResult, smallResult, mediumResult] = await Promise.all([
            uploadBufferToDrive(drive, variants.original.buffer, variants.original.name, file.type, originalFolderId),
            uploadBufferToDrive(drive, variants.thumb.buffer, variants.thumb.name, 'image/jpeg', thumbsFolderId),
            uploadBufferToDrive(drive, variants.small.buffer, variants.small.name, 'image/jpeg', smallFolderId),
            uploadBufferToDrive(drive, variants.medium.buffer, variants.medium.name, 'image/jpeg', mediumFolderId),
          ]);

          results.push({
            id: originalResult.id,
            name: file.name,
            mimeType: file.type,
            variants: {
              original: originalResult.id,
              thumb: thumbResult.id,
              small: smallResult.id,
              medium: mediumResult.id,
            },
          });
        }
      } catch (err: unknown) {
        console.error(`Failed to upload ${file.name}:`, err);
        errors.push(`${file.name}: Upload failed`);
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: 'All uploads failed', details: errors }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      files: results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Upload failed: ' + errorMessage }, { status: 500 });
  }
}

export async function GET() {
  console.log('=== GET /api/mediaupload called ===');
  try {
    if (!DRIVE_FOLDER_ID) {
      return NextResponse.json({ error: 'Server configuration error: DRIVE_FOLDER_ID missing' }, { status: 500 });
    }

    const drive = getDriveClient();

    // First, try to list files from the main folder (for backwards compatibility)
    console.log('Fetching files from main folder:', DRIVE_FOLDER_ID);
    const mainFolderResponse = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    });

    const mainFolderFiles = mainFolderResponse.data.files || [];
    console.log('Main folder files count:', mainFolderFiles.length);

    // If we have files in the main folder, return them in the old format
    // This handles the case before migration
    if (mainFolderFiles.length > 0) {
      // Check if any of them are NOT folders (i.e., actual files, not migrated yet)
      const actualFiles = mainFolderFiles.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');
      
      if (actualFiles.length > 0) {
        console.log('First file from Drive API:', JSON.stringify(actualFiles[0], null, 2));
        
        // Return in old format with backwards compatibility
        const files = actualFiles.map(file => {
          // Extract ID - it might be nested or at top level
          const fileId = file.id || (file as any).fileId || file.name;
          
          return {
            id: fileId,
            name: file.name || '',
            mimeType: file.mimeType || '',
            thumbnailLink: file.thumbnailLink,
            webViewLink: file.webViewLink,
          };
        });
        
        console.log('Mapped files count:', files.length);
        console.log('First mapped file:', JSON.stringify(files[0], null, 2));
        
        return NextResponse.json({ files });
      }
    }

    // If main folder is empty or only has subfolders, try the new structure
    // Get subfolders (only if they exist, don't create)
    const [thumbsFolderSearch, smallFolderSearch, mediumFolderSearch, originalFolderSearch] = await Promise.all([
      drive.files.list({
        q: `name='${SUBFOLDERS.thumbs}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)',
        pageSize: 1,
      }),
      drive.files.list({
        q: `name='${SUBFOLDERS.small}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)',
        pageSize: 1,
      }),
      drive.files.list({
        q: `name='${SUBFOLDERS.medium}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)',
        pageSize: 1,
      }),
      drive.files.list({
        q: `name='${SUBFOLDERS.original}' and '${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)',
        pageSize: 1,
      }),
    ]);

    const thumbsFolderId = thumbsFolderSearch.data.files?.[0]?.id;
    const smallFolderId = smallFolderSearch.data.files?.[0]?.id;
    const mediumFolderId = mediumFolderSearch.data.files?.[0]?.id;
    const originalFolderId = originalFolderSearch.data.files?.[0]?.id;

    // If no subfolders exist, return empty array
    if (!thumbsFolderId && !originalFolderId) {
      return NextResponse.json({ files: [] });
    }

    // Fetch files from existing subfolders only
    const fetchPromises = [];
    
    if (thumbsFolderId) {
      fetchPromises.push(
        drive.files.list({
          q: `'${thumbsFolderId}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType, createdTime)',
          orderBy: 'createdTime desc',
          pageSize: 100,
        })
      );
    } else {
      fetchPromises.push(Promise.resolve({ data: { files: [] } }));
    }

    if (smallFolderId) {
      fetchPromises.push(
        drive.files.list({
          q: `'${smallFolderId}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType, createdTime)',
          orderBy: 'createdTime desc',
          pageSize: 100,
        })
      );
    } else {
      fetchPromises.push(Promise.resolve({ data: { files: [] } }));
    }

    if (mediumFolderId) {
      fetchPromises.push(
        drive.files.list({
          q: `'${mediumFolderId}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType, createdTime)',
          orderBy: 'createdTime desc',
          pageSize: 100,
        })
      );
    } else {
      fetchPromises.push(Promise.resolve({ data: { files: [] } }));
    }

    if (originalFolderId) {
      fetchPromises.push(
        drive.files.list({
          q: `'${originalFolderId}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType, createdTime)',
          orderBy: 'createdTime desc',
          pageSize: 100,
        })
      );
    } else {
      fetchPromises.push(Promise.resolve({ data: { files: [] } }));
    }

    const [thumbsResponse, smallResponse, mediumResponse, originalResponse] = await Promise.all(fetchPromises);

    const thumbs = thumbsResponse.data.files || [];
    const small = smallResponse.data.files || [];
    const medium = mediumResponse.data.files || [];
    const originals = originalResponse.data.files || [];

    // Group files by base name (removing suffix)
    const fileGroups = new Map<string, any>();

    // Process thumbs as the primary list (for gallery display)
    thumbs.forEach(thumb => {
      const baseName = thumb.name!.replace(/_thumb\.jpg$/, '');
      fileGroups.set(baseName, {
        id: thumb.id, // Use thumb ID as the main ID
        name: baseName,
        mimeType: 'image/jpeg',
        createdTime: thumb.createdTime,
        variants: {
          thumb: thumb.id,
        },
      });
    });

    // Add small variants
    small.forEach(file => {
      const baseName = file.name!.replace(/_small\.jpg$/, '');
      if (fileGroups.has(baseName)) {
        fileGroups.get(baseName).variants.small = file.id;
      }
    });

    // Add medium variants
    medium.forEach(file => {
      const baseName = file.name!.replace(/_med\.jpg$/, '');
      if (fileGroups.has(baseName)) {
        fileGroups.get(baseName).variants.medium = file.id;
      }
    });

    // Add original variants (including videos)
    originals.forEach(file => {
      const baseName = file.name!.replace(/\.[^/.]+$/, ''); // Remove extension
      const isVideo = file.mimeType?.startsWith('video/');
      
      if (isVideo) {
        // Videos only have original
        fileGroups.set(baseName, {
          id: file.id, // Use original ID as the main ID for videos
          name: file.name,
          mimeType: file.mimeType,
          createdTime: file.createdTime,
          variants: {
            original: file.id,
          },
        });
      } else {
        // Images - add original to existing entry
        if (fileGroups.has(baseName)) {
          fileGroups.get(baseName).variants.original = file.id;
          fileGroups.get(baseName).mimeType = file.mimeType; // Use original mimeType
        }
      }
    });

    // Convert map to array
    const files = Array.from(fileGroups.values());

    return NextResponse.json({ files });

  } catch (error: unknown) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
