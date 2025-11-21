import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://maria-chris.vercel.app/callback/google'
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Log all query params for debugging
  console.log('OAuth callback received:', {
    code: code ? 'present' : 'missing',
    error,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  if (error) {
    return NextResponse.json({ 
      error: 'Authorization failed', 
      details: error,
      description: searchParams.get('error_description') 
    }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ 
      error: 'No authorization code received',
      receivedParams: Object.fromEntries(searchParams.entries())
    }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    return NextResponse.json({
      success: true,
      message: 'Authentication successful! Add these to your .env.local:',
      tokens: {
        GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
      },
      instructions: [
        '1. Copy the GOOGLE_REFRESH_TOKEN value',
        '2. Add it to your .env.local file',
        '3. Restart your development server',
      ],
    });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 500 });
  }
}
