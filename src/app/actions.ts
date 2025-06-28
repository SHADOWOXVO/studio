'use server';

import { summarizeDentalNotes } from '@/ai/flows/summarize-dental-notes';
import { z } from 'zod';

const SummarizeSchema = z.object({
  notes: z.string().min(1, 'Notes cannot be empty.'),
});

export async function getSummary(notes: string): Promise<{ summary?: string; error?: string }> {
  const validatedFields = SummarizeSchema.safeParse({ notes });

  if (!validatedFields.success) {
    return { error: 'Invalid notes.' };
  }

  try {
    const result = await summarizeDentalNotes({ notes: validatedFields.data.notes });
    return { summary: result.summary };
  } catch (error) {
    console.error('AI summarization failed:', error);
    return { error: 'Failed to generate summary due to a server error.' };
  }
}
