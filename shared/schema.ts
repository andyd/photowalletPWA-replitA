import { z } from "zod";

export interface Photo {
  id: string;
  blob: Blob;
  thumbnail: Blob; // Square-cropped thumbnail for grid display
  filename: string;
  order: number;
  createdAt: Date;
  archived?: boolean; // In overflow folder
  archivedAt?: Date;
}

export const photoSchema = z.object({
  id: z.string(),
  filename: z.string(),
  order: z.number(),
  createdAt: z.date(),
  archived: z.boolean().optional(),
  archivedAt: z.date().optional(),
});

export type PhotoMetadata = z.infer<typeof photoSchema>;
