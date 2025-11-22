import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }

    const drive = getDriveClient();

    // Get file metadata first to get the filename
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'name, mimeType',
    });

    // Download the file
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    // Convert the stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.data) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return the file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileMetadata.data.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileMetadata.data.name}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error: unknown) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
