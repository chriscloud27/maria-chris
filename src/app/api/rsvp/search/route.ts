import { NextRequest, NextResponse } from 'next/server';
import { findRSVPByName } from '@/lib/notionClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name || name.length < 3) {
    return NextResponse.json({ message: 'Name must be at least 3 characters long' }, { status: 400 });
  }

  try {
    const rsvpData = await findRSVPByName(name);
    if (rsvpData) {
      return NextResponse.json(rsvpData);
    } else {
      return NextResponse.json({ message: 'No RSVP found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error searching for RSVP:', error);
    return NextResponse.json({ error: 'Failed to search for RSVP' }, { status: 500 });
  }
}
