import * as React from 'react';

interface RsvpConfirmationEmailProps {
  name: string;
  attendance: 'accepted' | 'declined';
}

const RsvpConfirmationEmail: React.FC<Readonly<RsvpConfirmationEmailProps>> = ({
  name,
  attendance,
}) => (
  <div>
    <h1>Hi {name},</h1>
    <p>Thank you for your RSVP!</p>
    <p>
      You have marked your attendance as: <strong>{attendance === 'accepted' ? 'Happily Accept' : 'Regretfully Decline'}</strong>.
    </p>
    <p>We can&apos;t wait to celebrate with you!</p>
    <p>Best,</p>
    <p>The Bride and Groom</p>
  </div>
);

export default RsvpConfirmationEmail;
