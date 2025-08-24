import { NextRequest, NextResponse } from 'next/server';
import { addRSVP } from '@/lib/notionClient';
import { Resend } from 'resend';
import { renderRsvpConfirmationHtml } from '@/components/emails/RsvpConfirmation';
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
    console.log("Request Body:", body);

    const parsedData = rsvpSchema.safeParse(body);

    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error);
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { name, email, rsvp, notes, honeypot } = parsedData.data;

    // Persist to Notion
    try {
      console.log("Attempting to add RSVP to Notion:", { name, email, rsvp, notes });
      await addRSVP({ name, email, rsvp, notes });
      console.log("Successfully added RSVP to Notion");
    } catch (pErr: any) {
      console.error("Notion Error:", pErr, JSON.stringify(pErr)); // Include JSON.stringify
      return NextResponse.json({ error: 'Failed to save RSVP.' }, { status: 500 });
    }

    // Send confirmation email
    try {
      const html = renderRsvpConfirmationHtml({ name, rsvp, email, notes });
      console.log("Attempting to send confirmation email to:", email);

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Thank you for your RSVP!',
        html,
      });
      console.log("Successfully sent confirmation email to:", email);
    } catch (emailError: any) { // Add type any
      console.error("Resend Error:", emailError, JSON.stringify(emailError)); // Include JSON.stringify
      return NextResponse.json({ message: 'RSVP submitted successfully, but confirmation email failed.' });
    }

    return NextResponse.json({ message: 'RSVP submitted successfully!' });
  } catch (error: any) { // Add type any
    console.error("General API Error:", error, JSON.stringify(error));
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
    try {
      // Use server-side HTML renderer to avoid react-dom/server import in the API route
      const html = renderRsvpConfirmationHtml({ name, rsvp, email, notes });

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Thank you for your RSVP!',
        html,
      });
    } catch (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ message: 'RSVP submitted successfully, but confirmation email failed.' });
    }

    return NextResponse.json({ message: 'RSVP submitted successfully!' });
  } catch (error: any) {
    console.error('API error:', error, JSON.stringify(error)); // Log general API errors
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
