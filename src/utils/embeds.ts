import type { APIEmbedField } from 'discord.js';

export function calculateInlineIndex(fields: APIEmbedField[], currentFieldIndex: number) {
  const startIndex = currentFieldIndex - 1;

  for (let i = startIndex; i >= 0; i--) {
    const field = fields[i];
    if (!field) continue;

    if (field.inline === false) {
      const amount = startIndex - i;
      return (amount % 3) + 1;
    }
  }

  return (currentFieldIndex % 3) + 1;
}
