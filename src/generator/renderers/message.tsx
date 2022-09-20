import { DiscordMessage, DiscordReaction, DiscordReactions, DiscordReply } from '@skyra/discord-components-react';
import { Message, UserFlags } from 'discord.js';
import React from 'react';
import { RenderMessageContext } from "..";
import renderContent from './content';
import { renderEmbed } from './embed';

export default async function renderMessage(message: Message, context: RenderMessageContext) {
  const isCrosspost = message.reference && message.reference.guildId !== message.guild?.id;

  return (
    <DiscordMessage 
      author={message.member?.nickname ?? message.author.username} 
      id={`m-${message.id}`} 
      avatar={message.author.avatarURL() ?? undefined}
      roleColor={message.member?.displayHexColor ?? undefined}
      timestamp={message.createdAt}
      key={message.id}
      edited={message.editedAt !== null}
      verified={message.author.flags?.has(UserFlags.VerifiedBot)}
      roleIcon={message.member?.roles.icon?.iconURL() ?? undefined}
      server={isCrosspost ?? undefined}
      bot={!isCrosspost && message.author.bot}
      highlight={message.mentions.everyone}
    >
      {/* message content */}
      {
        message.content && (
          await renderContent(message.content, { ...context, inEmbed: false })
        )
      }

      {/* message embeds */}
      {
        message.embeds.length > 0 && (
          await Promise.all(
            message.embeds.map(async (embed, id) => (
              await renderEmbed(embed, { ...context, index: id, message })
            ))
          )
        )
      }

      {/* reactions */}
      {
        message.reactions.cache.size > 0 && (
          <DiscordReactions
            slot="reactions"
          >
            {
              message.reactions.cache.map((reaction, id) => (
                reaction.emoji.id ? (
                    <DiscordReaction
                      key={`${message.id}-r-${id}`}
                      emoji={`https://cdn.discordapp.com/emojis/${reaction.emoji.id}.${reaction.emoji.animated ? "gif" : 'png'}`}
                      count={reaction.count}
                    />
                  ) : (
                    (console.log(reaction, id) as unknown || true) && <DiscordReaction
                      key={`${message.id}-r-${id}`}
                      name={reaction.emoji.name!}
                      emoji={"https://discord.com/assets/7c010dc6da25c012643ea22c1f002bb4.svg"}
                      count={reaction.count}
                    />
                  )
                )
              )
            }
          </DiscordReactions>
        )
      }
    </DiscordMessage>
  )
}