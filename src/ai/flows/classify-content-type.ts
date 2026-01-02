'use server';

/**
 * @fileOverview An AI agent that classifies the content type of a scraped URL.
 *
 * - classifyContentType - A function that classifies the content type of a scraped URL.
 * - ClassifyContentTypeInput - The input type for the classifyContentType function.
 * - ClassifyContentTypeOutput - The return type for the classifyContentType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyContentTypeInputSchema = z.object({
  title: z.string().describe('The title of the web page.'),
  metaDescription: z.string().describe('The meta description of the web page.'),
  headings: z.array(z.string()).describe('All headings (h1-h6) from the web page.'),
  paragraphs: z.array(z.string()).describe('All paragraphs from the web page.'),
  jsonLd: z.string().optional().describe('The JSON-LD data from the web page, if available.'),
});
export type ClassifyContentTypeInput = z.infer<typeof ClassifyContentTypeInputSchema>;

const ClassifyContentTypeOutputSchema = z.object({
  contentType: z.string().describe('The classified content type of the web page (e.g., blog, product, news).'),
});
export type ClassifyContentTypeOutput = z.infer<typeof ClassifyContentTypeOutputSchema>;

export async function classifyContentType(input: ClassifyContentTypeInput): Promise<ClassifyContentTypeOutput> {
  return classifyContentTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyContentTypePrompt',
  input: {schema: ClassifyContentTypeInputSchema},
  output: {schema: ClassifyContentTypeOutputSchema},
  prompt: `You are an expert content classifier. Analyze the provided information from a web page and determine its content type (e.g., blog, product, news, article, documentation, portfolio, etc.).

Consider the following information:

Title: {{{title}}}
Meta Description: {{{metaDescription}}}
Headings: {{#each headings}}{{{this}}}\n{{/each}}
Paragraphs: {{#each paragraphs}}{{{this}}}\n{{/each}}
JSON-LD: {{{jsonLd}}}

Content Type:`,
});

const classifyContentTypeFlow = ai.defineFlow(
  {
    name: 'classifyContentTypeFlow',
    inputSchema: ClassifyContentTypeInputSchema,
    outputSchema: ClassifyContentTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
