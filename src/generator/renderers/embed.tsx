import {
	DiscordEmbed,
	DiscordEmbedDescription,
	DiscordEmbedField,
	DiscordEmbedFields,
	DiscordEmbedFooter,
} from '@derockdev/discord-components-react';
import type { Embed, Message } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import { calculateInlineIndex } from '../../utils/embeds';
import renderContent, { RenderType } from './content';

type RenderEmbedContext = RenderMessageContext & {
	index: number;
	message: Message;
};

export async function renderEmbed(embed: Embed, context: RenderEmbedContext) {
	return (
		<DiscordEmbed
			embedTitle={embed.title ?? undefined}
			slot="embeds"
			key={`${context.message.id}-e-${context.index}`}
			authorImage={embed.author?.proxyIconURL ?? embed.author?.iconURL}
			authorName={embed.author?.name}
			authorUrl={embed.author?.url}
			color={embed.hexColor ?? undefined}
			image={embed.image?.proxyURL ?? embed.image?.url}
			thumbnail={embed.thumbnail?.proxyURL ?? embed.thumbnail?.url}
			url={embed.url ?? undefined}
		>
			{/* Description */}
			{embed.description && (
				<DiscordEmbedDescription slot="description">
					{await renderContent(embed.description, { ...context, type: RenderType.EMBED })}
				</DiscordEmbedDescription>
			)}

			{/* Fields */}
			{embed.fields.length > 0 && (
				<DiscordEmbedFields slot="fields">
					{await Promise.all(
						embed.fields.map(async (field, id) => (
							<DiscordEmbedField
								key={`${context.message.id}-e-${context.index}-f-${id}`}
								fieldTitle={field.name}
								inline={field.inline}
								inlineIndex={calculateInlineIndex(embed.fields, id)}
							>
								{await renderContent(field.value, { ...context, type: RenderType.EMBED })}
							</DiscordEmbedField>
						)),
					)}
				</DiscordEmbedFields>
			)}

			{/* Footer */}
			{embed.footer && (
				<DiscordEmbedFooter
					slot="footer"
					footerImage={embed.footer.proxyIconURL ?? embed.footer.iconURL}
					timestamp={embed.timestamp ?? undefined}
				>
					{embed.footer.text}
				</DiscordEmbedFooter>
			)}
		</DiscordEmbed>
	);
}
