import { findRSVPByCode } from '@/lib/notionClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    // First, try to find the code assuming the Notion property is 'rich_text' (a standard Text field)
    let rsvp = await findRSVPByCode(code, 'rich_text');

    // If not found, try again assuming the property is 'title' (the main Title field)
    if (!rsvp) {
      rsvp = await findRSVPByCode(code, 'title');
    }

    if (rsvp) {
      return NextResponse.json(rsvp);
    } else {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error searching for RSVP by code:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
