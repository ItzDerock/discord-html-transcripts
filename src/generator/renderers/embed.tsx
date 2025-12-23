import type { Embed, Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import { calculateInlineIndex } from '../../utils/embeds';
import MessageContent, { RenderType } from './content';

type RenderEmbedContext = RenderMessageContext & {
  index: number;
  message: Message;
};

export async function DiscordEmbed({ embed, context }: { embed: Embed; context: RenderEmbedContext }) {
  return (
    <discord-embed
      embed-title={embed.title ?? undefined}
      slot="embeds"
      key={`${context.message.id}-e-${context.index}`}
      author-image={embed.author?.proxyIconURL ?? embed.author?.iconURL}
      author-name={embed.author?.name}
      author-url={embed.author?.url}
      color={embed.hexColor ?? undefined}
      image={embed.image?.proxyURL ?? embed.image?.url}
      thumbnail={embed.thumbnail?.proxyURL ?? embed.thumbnail?.url}
      url={embed.url ?? undefined}
    >
      {/* Description */}
      {embed.description && (
        <discord-embed-description slot="description">
          <MessageContent content={embed.description} context={{ ...context, type: RenderType.EMBED }} />
        </discord-embed-description>
      )}

      {/* Fields */}
      {embed.fields.length > 0 && (
        <discord-embed-fields slot="fields">
          {embed.fields.map(async (field, id) => (
            <discord-embed-field
              key={`${context.message.id}-e-${context.index}-f-${id}`}
              field-title={field.name}
              inline={!!field.inline}
              inline-index={field.inline ? calculateInlineIndex(embed.fields, id) : undefined}
            >
              <MessageContent content={field.value} context={{ ...context, type: RenderType.EMBED }} />
            </discord-embed-field>
          ))}
        </discord-embed-fields>
      )}

      {/* Footer */}
      {embed.footer && (
        <discord-embed-footer
          slot="footer"
          footerImage={embed.footer.proxyIconURL ?? embed.footer.iconURL}
          timestamp={embed.timestamp ?? undefined}
        >
          {embed.footer.text}
        </discord-embed-footer>
      )}
    </discord-embed>
  );
}
