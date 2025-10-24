'use server';

/**
 * @fileOverview A flow to suggest potential animal matches based on user lifestyle and preferences.
 *
 * - suggestAnimalMatches - A function that takes user preferences and animal profiles to suggest best matches.
 * - SuggestAnimalMatchesInput - The input type for the suggestAnimalMatches function.
 * - SuggestAnimalMatchesOutput - The return type for the suggestAnimalMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAnimalMatchesInputSchema = z.object({
  lifestyle: z.string().describe('Description of the user lifestyle, including activity level, living situation, and family.'),
  preferences: z.string().describe('User preferences for an animal, including species, breed, age, size, and temperament.'),
  animalProfiles: z.string().array().describe('Array of animal profiles, including descriptions and traits in the format "ID: [id], ...".'),
});
export type SuggestAnimalMatchesInput = z.infer<typeof SuggestAnimalMatchesInputSchema>;

const SuggestAnimalMatchesOutputSchema = z.object({
  matchIds: z.string().array().describe('An array of IDs for the suggested animal profiles that best match the user lifestyle and preferences. The IDs should be extracted from the animal profiles.'),
});
export type SuggestAnimalMatchesOutput = z.infer<typeof SuggestAnimalMatchesOutputSchema>;

export async function suggestAnimalMatches(input: SuggestAnimalMatchesInput): Promise<SuggestAnimalMatchesOutput> {
  return suggestAnimalMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAnimalMatchesPrompt',
  input: {schema: SuggestAnimalMatchesInputSchema},
  output: {schema: SuggestAnimalMatchesOutputSchema},
  prompt: `You are an AI assistant designed to suggest potential animal matches for a user based on their lifestyle and preferences.

  Analyze the following user lifestyle and preferences:
  Lifestyle: {{{lifestyle}}}
  Preferences: {{{preferences}}}

  Consider the following animal profiles:
  {{#each animalProfiles}}
  - {{{this}}}
  {{/each}}

  Based on this information, suggest the best animal matches from the provided profiles.
  Return an array of the animal IDs that best fit the user.
  `,
});

const suggestAnimalMatchesFlow = ai.defineFlow(
  {
    name: 'suggestAnimalMatchesFlow',
    inputSchema: SuggestAnimalMatchesInputSchema,
    outputSchema: SuggestAnimalMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
