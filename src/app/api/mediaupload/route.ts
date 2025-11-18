import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

// Initialize Google Drive client
// We use a function to lazily initialize to avoid errors during build time if env vars are missing
const getDriveClient = () => {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!credentialsJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set');
  }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
};

const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

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
        const bufferStream = webStreamToNodeStream(file.stream());
        const response = await drive.files.create({
          requestBody: {
            name: file.name,
            parents: [DRIVE_FOLDER_ID],
            mimeType: file.type,
          },
          media: {
            mimeType: file.type,
            body: bufferStream,
          },
          fields: 'id, name, webViewLink, thumbnailLink',
        });

        results.push({
          id: response.data.id,
          name: response.data.name,
          webViewLink: response.data.webViewLink,
        });
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
  try {
    if (!DRIVE_FOLDER_ID) {
      return NextResponse.json({ error: 'Server configuration error: DRIVE_FOLDER_ID missing' }, { status: 500 });
    }

    const drive = getDriveClient();

    // List files in the folder
    // We request thumbnailLink to display previews
    const response = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 50, // Limit for MVP
    });

    const files = response.data.files || [];

    return NextResponse.json({ files });

  } catch (error: unknown) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
