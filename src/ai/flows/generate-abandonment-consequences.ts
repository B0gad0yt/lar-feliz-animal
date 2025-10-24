'use server';

/**
 * @fileOverview Explains the consequences of abandoning animals using analogies.
 *
 * - generateAbandonmentConsequences - A function that generates explanations about the consequences of abandoning animals.
 * - GenerateAbandonmentConsequencesInput - The input type for the generateAbandonmentConsequences function.
 * - GenerateAbandonmentConsequencesOutput - The return type for the generateAbandonmentConsequences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAbandonmentConsequencesInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic about the abandonment consequences that the user wants to understand.'),
});

export type GenerateAbandonmentConsequencesInput = z.infer<
  typeof GenerateAbandonmentConsequencesInputSchema
>;

const GenerateAbandonmentConsequencesOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A simple explanation of the topic about the consequences of abandoning animals using analogies.'
    ),
});

export type GenerateAbandonmentConsequencesOutput = z.infer<
  typeof GenerateAbandonmentConsequencesOutputSchema
>;

export async function generateAbandonmentConsequences(
  input: GenerateAbandonmentConsequencesInput
): Promise<GenerateAbandonmentConsequencesOutput> {
  return generateAbandonmentConsequencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAbandonmentConsequencesPrompt',
  input: {schema: GenerateAbandonmentConsequencesInputSchema},
  output: {schema: GenerateAbandonmentConsequencesOutputSchema},
  prompt: `Explain the following topic about the consequences of abandoning animals in a simple, easy-to-understand manner, using analogies to make the information more relatable. Topic: {{{topic}}}`,
});

const generateAbandonmentConsequencesFlow = ai.defineFlow(
  {
    name: 'generateAbandonmentConsequencesFlow',
    inputSchema: GenerateAbandonmentConsequencesInputSchema,
    outputSchema: GenerateAbandonmentConsequencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
