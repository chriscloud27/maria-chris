import { z } from 'zod';

// Notion-aligned RSVP schema:
// - Name -> name (title)
// - Email -> email
// - RSVP  -> rsvp (select: "Yes" | "No" | "Maybe")
// - Notes -> notes (rich text)
// - Song -> song (text)
export const rsvpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  rsvp: z.enum(['Yes', 'No', 'Maybe']),
  notes: z.string().max(1000).optional(),
  song: z.string().max(200).optional(),
  boat: z.boolean().optional(),
  // honeypot is present for spam protection but ignored by persistence
  honeypot: z.string().optional(),
});

// exported type for use in forms and other modules
export type RsvpData = z.infer<typeof rsvpSchema>;
