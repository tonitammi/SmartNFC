import * as z from 'zod';

export const TagSchema = z.object({
  label: z.string().min(3),
  address: z.string().optional(),
  room: z.string().optional(),
  floor: z.string().optional(),
  building: z.string().optional(),
  specific_location: z.string().optional(),
});

export const UpdateTagSchema = z.object({
  label: z.string().min(3),
  address: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  floor: z.string().optional().nullable(),
  building: z.string().optional().nullable(),
  specific_location: z.string().optional().nullable(),
});