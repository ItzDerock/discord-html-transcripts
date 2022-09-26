import type { APIEmbedField } from 'discord.js';

export const calculateAmountOfTrue = (array: boolean[]) => {
  // get the amount of true values before endIndex, stopping at the first false value
  for (let i = array.length - 1; i >= 0; i--) {
    if (!array[i]) {
      return array.length - i;
    }
  }

  return array.length - 1;
};

export function calculateInlineIndex(fields: APIEmbedField[], currentFieldIndex: number) {
  // get the amount of inline fields before the current field without gaps
  const inlineFieldsBefore = fields.slice(0, currentFieldIndex).map((e) => e.inline ?? false);

  const amount = calculateAmountOfTrue(inlineFieldsBefore) + 1;

  return (amount % 3) + 1;
}
