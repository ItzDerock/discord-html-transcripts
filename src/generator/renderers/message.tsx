import {
  DiscordAttachments,
  DiscordCommand,
  DiscordMessage,
  DiscordReaction,
  DiscordReactions,
  DiscordThread,
  DiscordThreadMessage,
} from '@derockdev/discord-components-react';
import type { Message } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import { parseDiscordEmoji } from '../../utils/utils';
import renderAttachments from './attachment';
import renderComponentRow from './components';
import renderContent, { RenderType } from './content';
import { renderEmbed } from './embed';
import renderReply from './reply';
import renderSystemMessage from './systemMessage';

export default async function renderMessage(message: Message, context: RenderMessageContext) {
  if (message.system) return renderSystemMessage(message);

  const isCrosspost = message.reference && message.reference.guildId !== message.guild?.id;

  return (
    <DiscordMessage
      id={`m-${message.id}`}
      timestamp={message.createdAt}
      key={message.id}
      edited={message.editedAt !== null}
      server={isCrosspost ?? undefined}
      highlight={message.mentions.everyone}
      profile={message.author.id}
    >
      {/* reply */}
      {await renderReply(message, context)}

      {/* slash command */}
      {message.interaction && (
        <DiscordCommand
          slot="reply"
          profile={message.interaction.user.id}
          command={'/' + message.interaction.commandName}
        />
      )}

      {/* message content */}
      {message.content && (await renderContent(message.content, { ...context, type: RenderType.NORMAL }))}

      {/* attachments */}
      {await renderAttachments(message, context)}

      {/* message embeds */}
      {message.embeds.length > 0 &&
        (await Promise.all(
          message.embeds.map(async (embed, id) => await renderEmbed(embed, { ...context, index: id, message })),
        ))}

      {/* components */}
      {message.components.length > 0 && (
        <DiscordAttachments slot="components">
          {message.components.map((component, id) => renderComponentRow(component, id))}
        </DiscordAttachments>
      )}

      {/* reactions */}
      {message.reactions.cache.size > 0 && (
        <DiscordReactions slot="reactions">
          {message.reactions.cache.map((reaction, id) =>
            reaction.emoji.id ? (
              <DiscordReaction
                key={`${message.id}r${id}`}
                emoji={`https://cdn.discordapp.com/emojis/${reaction.emoji.id}.${
                  reaction.emoji.animated ? 'gif' : 'png'
                }`}
                count={reaction.count}
              />
            ) : (
              <DiscordReaction
                key={`${message.id}r${id}`}
                name={reaction.emoji.name!}
                emoji={parseDiscordEmoji(reaction.emoji)}
                count={reaction.count}
              />
            ),
          )}
        </DiscordReactions>
      )}

      {/* threads */}
      {message.hasThread && message.thread && (
        <DiscordThread
          slot="thread"
          name={message.thread.name}
          cta={
            message.thread.messageCount
              ? `${message.thread.messageCount} Message${message.thread.messageCount > 1 ? 's' : ''}`
              : 'View Thread'
          }
        >
          {message.thread.lastMessage ? (
            <DiscordThreadMessage profile={message.thread.lastMessage.id}>
              {await renderContent(
                message.thread.lastMessage.content.length > 128
                  ? message.thread.lastMessage.content.substring(0, 125) + '...'
                  : message.thread.lastMessage.content,
                { ...context, type: RenderType.REPLY },
              )}
            </DiscordThreadMessage>
          ) : (
            `Thread messages not saved.`
          )}
        </DiscordThread>
      )}
    </DiscordMessage>
  );
}
