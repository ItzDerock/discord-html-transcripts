import { DiscordEmbed, DiscordEmbedDescription, DiscordEmbedField, DiscordEmbedFields, DiscordEmbedFooter } from "@skyra/discord-components-react";
import { Embed, Message } from "discord.js";
import React from 'react';
import { RenderMessageContext } from "..";
import { calculateInlineIndex } from "../../utils/embeds";
import renderContent from "./content";

type RenderEmbedContext = RenderMessageContext & {
  index: number;
  message: Message
}

export async function renderEmbed(embed: Embed, context: RenderEmbedContext) {
  return (
    <DiscordEmbed
      embedTitle="Embed Title"
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
      {
        embed.description && (
          <DiscordEmbedDescription slot="description">
            {
              await renderContent(embed.description, { ...context, inEmbed: true })
            }
          </DiscordEmbedDescription>
        )
      }

      {/* Fields */}
      {
        embed.fields.length > 0 && (
          <DiscordEmbedFields slot="fields">
            {
              await Promise.all(
                embed.fields.map(async (field, id) => (
                  <DiscordEmbedField
                    key={`${context.message.id}-e-${context.index}-f-${id}`}
                    fieldTitle={field.name}
                    inline={field.inline}
                    inlineIndex={calculateInlineIndex(embed.fields, id)}
                  >
                    {
                      await renderContent(field.value, { ...context, inEmbed: true })
                    }
                  </DiscordEmbedField>
                ))
              )
            }
          </DiscordEmbedFields>
        )
      }

      {/* Footer */}
      {
        embed.footer && (
          <DiscordEmbedFooter
            slot="footer"
            footerImage={embed.footer.proxyIconURL ?? embed.footer.iconURL}
            timestamp={embed.timestamp ?? undefined}
          >
            {embed.footer.text}
          </DiscordEmbedFooter>
        )
      }
    </DiscordEmbed>
  )
}