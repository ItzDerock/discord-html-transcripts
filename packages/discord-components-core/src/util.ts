import type { Emoji } from './options';

export type DiscordTimestamp = Date | string | null;

export const handleTimestamp = (value: DiscordTimestamp, hour24 = false): string | null => {
	if (!(value instanceof Date) && typeof value !== 'string') {
		throw new TypeError('Timestamp prop must be a Date object or a string.');
	}

	return new Date(value)
		.toLocaleDateString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: !hour24
		})
		.replace(',', '');
};

export const getGlobalEmojiUrl = (emojiName: string): Emoji | undefined => window.$discordMessage?.emojis?.[emojiName];
