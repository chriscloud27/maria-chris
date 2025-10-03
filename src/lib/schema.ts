import { z } from 'zod';

// Notion-aligned RSVP schema:
// - CO/DE -> 'CO/DE' (text) - location/country identifier
// - Code -> code (text) - invitation code identifier
// - Name -> name (title)
// - Email -> email
// - WhatsApp -> whatsapp (phone number)
// - RSVP  -> rsvp (select: "Yes" | "No" | "Maybe")
// - +1 -> '+1' (boolean) - plus one checkbox
// - 19-Connect -> '19-Connect' (boolean) - connect event checkbox
// - BigDay -> 'BigDay' (boolean) - main wedding day checkbox
// - 21-Boat -> '21-Boat' (boolean) - boat event checkbox
// - Notes -> notes (rich text)
// - Song -> song (text)
export const rsvpSchema = z.object({
  'CO/DE': z.string().min(1, 'CO/DE is required'),
  code: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().optional(),
  rsvp: z.enum(['Yes', 'No', 'Maybe']).optional(),
  '+1': z.boolean().optional(),
  '19-Connect': z.boolean().optional(),
  'BigDay': z.boolean().optional(),
  '21-Boat': z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  song: z.string().max(200).optional(),
  // honeypot is present for spam protection but ignored by persistence
  honeypot: z.string().optional(),
});

// exported type for use in forms and other modules
export type RsvpData = z.infer<typeof rsvpSchema>;
