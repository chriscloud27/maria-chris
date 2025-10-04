import * as React from 'react';

interface RsvpConfirmationEmailProps {
  name: string;
  rsvp: 'Yes' | 'No' | 'Maybe';
  notes?: string;
}

const RsvpConfirmationEmail: React.FC<Readonly<RsvpConfirmationEmailProps>> = ({
  name,
  rsvp,
  notes,
}) => (
  <div>
    <h1>Hi {name},</h1>
    <p>Thank you — your RSVP has been recorded in our RSVP database.</p>
    <p>
      RSVP: <strong>{rsvp}</strong>
    </p>
    {/* Email removed */}
    {notes && (
      <p>
        Notes: <em>{notes}</em>
      </p>
    )}
    <p>We can&apos;t wait to celebrate with you!</p>
    <p>Best,</p>
    <p>The Bride and Groom</p>
  </div>
);

export default RsvpConfirmationEmail;

// Server-side helper: returns a plain HTML string (safe-escaped)
export function renderRsvpConfirmationHtml(props: RsvpConfirmationEmailProps): string {
  // escape minimal HTML special chars to avoid injection
  const escapeHtml = (str?: string) =>
    String(str ?? '').replace(/[&<>"']/g, (s) => {
      switch (s) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return s;
      }
    });

  const name = escapeHtml(props.name);
  const rsvp = escapeHtml(props.rsvp);
  const notes = props.notes ? `<p>Notes: <em>${escapeHtml(props.notes)}</em></p>` : '';

  return [
    '<!doctype html>',
    '<html>',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>',
    '<body>',
    `<h1>Hi ${name},</h1>`,
    '<p>Thank you — your RSVP has been recorded in our RSVP database.</p>',
    `<p>RSVP: <strong>${rsvp}</strong></p>`,
    notes,
    "<p>We can't wait to celebrate with you!</p>",
    '<p>Best,</p>',
    '<p>The Bride and Groom</p>',
    '</body>',
    '</html>',
  ].join('');
}
