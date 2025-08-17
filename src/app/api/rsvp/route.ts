import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import RsvpConfirmationEmail from '@/components/emails/RsvpConfirmation';
import { rsvpSchema } from '@/lib/schema';

const resend = new Resend(process.env.RESEND_API_KEY);
const rsvpDeadline = process.env.RSVP_DEADLINE; // e.g., '2026-05-10T23:59:59'
const fromEmail = process.env.RESEND_FROM_EMAIL; // e.g., 'Wedding RSVP <noreply@yourdomain.com>'

export async function POST(req: NextRequest) {
  // Check if the deadline has passed
  if (rsvpDeadline && new Date() > new Date(rsvpDeadline)) {
    return NextResponse.json({ error: 'The RSVP deadline has passed.' }, { status: 400 });
  }

  if (!fromEmail) {
    console.error('RESEND_FROM_EMAIL environment variable is not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const parsedData = rsvpSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { name, email, attendance, song, message } = parsedData.data;

    // Insert data into Supabase
    const { error } = await supabase
      .from('wedding_rsvps')
      .insert([{ name, email, attendance, song, message }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      // Check for unique constraint violation
      if (error.code === '23505') {
          return NextResponse.json({ error: 'An RSVP with this email has already been submitted.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to save RSVP.' }, { status: 500 });
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Thank you for your RSVP!',
        react: RsvpConfirmationEmail({ name, attendance }),
      });
    } catch (emailError) {
        console.error('Resend error:', emailError);
        // Even if email fails, the RSVP was saved.
        // You might want to log this for manual follow-up.
        return NextResponse.json({ message: 'RSVP submitted successfully, but confirmation email failed.' });
    }


    return NextResponse.json({ message: 'RSVP submitted successfully!' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
