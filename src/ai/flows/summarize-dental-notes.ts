// Summarizes dental notes using AI to provide a concise overview for dentists.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDentalNotesInputSchema = z.object({
  notes: z.string().describe('The dental notes to summarize.'),
});
export type SummarizeDentalNotesInput = z.infer<typeof SummarizeDentalNotesInputSchema>;

const SummarizeDentalNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized dental notes.'),
});
export type SummarizeDentalNotesOutput = z.infer<typeof SummarizeDentalNotesOutputSchema>;

export async function summarizeDentalNotes(input: SummarizeDentalNotesInput): Promise<SummarizeDentalNotesOutput> {
  return summarizeDentalNotesFlow(input);
}

const summarizeDentalNotesPrompt = ai.definePrompt({
  name: 'summarizeDentalNotesPrompt',
  input: {
    schema: SummarizeDentalNotesInputSchema,
  },
  output: {
    schema: SummarizeDentalNotesOutputSchema,
  },
  prompt: `Summarize the following dental notes:\n\n{{{notes}}}`,
});

const summarizeDentalNotesFlow = ai.defineFlow(
  {
    name: 'summarizeDentalNotesFlow',
    inputSchema: SummarizeDentalNotesInputSchema,
    outputSchema: SummarizeDentalNotesOutputSchema,
  },
  async input => {
    const {output} = await summarizeDentalNotesPrompt(input);
    return output!;
  }
);
