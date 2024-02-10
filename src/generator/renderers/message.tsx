import {
  DiscordAttachments,
  DiscordCommand,
  DiscordMessage as DiscordMessageComponent,
  DiscordReaction,
  DiscordReactions,
  DiscordThread,
  DiscordThreadMessage,
} from '@derockdev/discord-components-react';
import type { Message as MessageType } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import { parseDiscordEmoji } from '../../utils/utils';
import { Attachments } from './attachment';
import ComponentRow from './components';
import MessageContent, { RenderType } from './content';
import { DiscordEmbed } from './embed';
import MessageReply from './reply';
import DiscordSystemMessage from './systemMessage';

export default async function DiscordMessage({
  message,
  context,
}: {
  message: MessageType;
  context: RenderMessageContext;
}) {
  if (message.system) return <DiscordSystemMessage message={message} />;

  const isCrosspost = message.reference && message.reference.guildId !== message.guild?.id;

  return (
    <DiscordMessageComponent
      id={`m-${message.id}`}
      timestamp={message.createdAt.toISOString()}
      key={message.id}
      edited={message.editedAt !== null}
      server={isCrosspost ?? undefined}
      highlight={message.mentions.everyone}
      profile={message.author.id}
    >
      {/* reply */}
      <MessageReply message={message} context={context} />

      {/* slash command */}
      {message.interaction && (
        <DiscordCommand
          slot="reply"
          profile={message.interaction.user.id}
          command={'/' + message.interaction.commandName}
        />
      )}

      {/* message content */}
      {message.content && (
        <MessageContent
          content={message.content}
          context={{ ...context, type: message.webhookId ? RenderType.WEBHOOK : RenderType.NORMAL }}
        />
      )}

      {/* attachments */}
      <Attachments message={message} context={context} />

      {/* message embeds */}
      {message.embeds.map((embed, id) => (
        <DiscordEmbed embed={embed} context={{ ...context, index: id, message }} key={id} />
      ))}

      {/* components */}
      {message.components.length > 0 && (
        <DiscordAttachments slot="components">
          {message.components.map((component, id) => (
            <ComponentRow key={id} id={id} row={component} />
          ))}
        </DiscordAttachments>
      )}

      {/* reactions */}
      {message.reactions.cache.size > 0 && (
        <DiscordReactions slot="reactions">
          {message.reactions.cache.map((reaction, id) => (
            <DiscordReaction
              key={`${message.id}r${id}`}
              name={reaction.emoji.name!}
              emoji={parseDiscordEmoji(reaction.emoji)}
              count={reaction.count}
            />
          ))}
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
            <DiscordThreadMessage profile={message.thread.lastMessage.author.id}>
              <MessageContent
                content={
                  message.thread.lastMessage.content.length > 128
                    ? message.thread.lastMessage.content.substring(0, 125) + '...'
                    : message.thread.lastMessage.content
                }
                context={{ ...context, type: RenderType.REPLY }}
              />
            </DiscordThreadMessage>
          ) : (
            `Thread messages not saved.`
          )}
        </DiscordThread>
      )}
    </DiscordMessageComponent>
  );
}
