import { NextRequest, NextResponse } from 'next/server';
import { addRSVP } from '@/lib/notionClient';
import { rsvpSchema } from '@/lib/schema';

// const rsvpDeadline = process.env.RSVP_DEADLINE; // e.g., '2026-05-10T23:59:59'

export async function POST(req: NextRequest) {
  // Check if the deadline has passed
  // if (rsvpDeadline && new Date() > new Date(rsvpDeadline)) {
  //   return NextResponse.json({ error: 'The RSVP deadline has passed.' }, { status: 400 });
  // }

  try {
    const body = await req.json();
    console.log('Request Body:', body);

    const parsedData = rsvpSchema.safeParse(body);

    if (!parsedData.success) {
      console.error('Validation Error:', parsedData.error);
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { 'CO/DE': coDe, code, name, email, whatsapp, rsvp, '+1': plusOne, '19-Connect': connect19, 'BigDay': bigDay, '21-Boat': boat21, notes, song } = parsedData.data;

    // Persist to Notion
    try {
      console.log('Attempting to add or update RSVP to Notion:', { 'CO/DE': coDe, code, name, email, whatsapp, rsvp: rsvp || 'Yes', '+1': plusOne, '19-Connect': connect19, 'BigDay': bigDay, '21-Boat': boat21, notes, song });
      await addRSVP({ 'CO/DE': coDe, code, name, email, whatsapp, rsvp: rsvp || 'Yes', '+1': plusOne, '19-Connect': connect19, 'BigDay': bigDay, '21-Boat': boat21, notes, song });
      console.log('Successfully added or updated RSVP in Notion');
    } catch (pErr: unknown) {
      if (pErr instanceof Error) {
        console.error('Notion Error:', pErr.message, JSON.stringify(pErr));
      } else {
        console.error('Notion Error:', pErr);
      }
      return NextResponse.json({ error: 'Failed to save RSVP.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'RSVP submitted successfully!' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('General API Error:', error.message, JSON.stringify(error));
    } else {
      console.error('General API Error:', error);
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}