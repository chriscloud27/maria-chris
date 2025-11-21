import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://maria-chris.vercel.app/callback/google'
);

export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  });

  return NextResponse.redirect(authUrl);
}
