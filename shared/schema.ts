import { z } from "zod";

export interface Photo {
  id: string;
  blob: Blob;
  thumbnail: Blob; // Square-cropped thumbnail for grid display
  filename: string;
  order: number;
  createdAt: Date;
}

export const photoSchema = z.object({
  id: z.string(),
  filename: z.string(),
  order: z.number(),
  createdAt: z.date(),
});

export type PhotoMetadata = z.infer<typeof photoSchema>;
