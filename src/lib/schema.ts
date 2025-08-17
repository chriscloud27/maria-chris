import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(120),
  email: z.string().email({ message: 'Invalid email address' }),
  attendance: z.enum(['accepted', 'declined']),
  song: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
});

export type RsvpData = z.infer<typeof rsvpSchema>;
