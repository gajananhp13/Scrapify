// Summarizes web page content.

'use server';

/**
 * @fileOverview Summarizes web page content using AI.
 *
 * - summarizeWebPage - A function that handles the web page summarization process.
 * - SummarizeWebPageInput - The input type for the summarizeWebPage function.
 * - SummarizeWebPageOutput - The return type for the summarizeWebPage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWebPageInputSchema = z.object({
  title: z.string().describe('The title of the web page.'),
  metaDescription: z.string().describe('The meta description of the web page.'),
  headings: z.string().describe('All headings (h1-h6) of the web page content.'),
  paragraphs: z.string().describe('All paragraphs of the web page content.'),
  jsonld: z.string().describe('The JSON-LD structured data of the web page.'),
});
export type SummarizeWebPageInput = z.infer<typeof SummarizeWebPageInputSchema>;

const SummarizeWebPageOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the web page content.'),
});
export type SummarizeWebPageOutput = z.infer<typeof SummarizeWebPageOutputSchema>;

export async function summarizeWebPage(input: SummarizeWebPageInput): Promise<SummarizeWebPageOutput> {
  return summarizeWebPageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWebPagePrompt',
  input: {schema: SummarizeWebPageInputSchema},
  output: {schema: SummarizeWebPageOutputSchema},
  prompt: `You are an AI expert in summarizing web pages.  Create a concise summary of the web page content. The summary should be no more than 3 sentences.

Consider the following information when summarizing:

Title: {{{title}}}
Meta Description: {{{metaDescription}}}
Headings: {{{headings}}}
Paragraphs: {{{paragraphs}}}
JSON-LD: {{{jsonld}}}`,
});

const summarizeWebPageFlow = ai.defineFlow(
  {
    name: 'summarizeWebPageFlow',
    inputSchema: SummarizeWebPageInputSchema,
    outputSchema: SummarizeWebPageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
