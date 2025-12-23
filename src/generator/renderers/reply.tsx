import { type Message, UserFlags } from 'discord.js';
import type { RenderMessageContext } from '..';
import MessageContent, { RenderType } from './content';

export default async function MessageReply({ message, context }: { message: Message; context: RenderMessageContext }) {
  if (!message.reference) return null;
  if (message.reference.guildId !== message.guild?.id) return null;

  const referencedMessage = context.messages.find((m) => m.id === message.reference!.messageId);
  if (!referencedMessage) return <discord-reply slot="reply">Message could not be loaded.</discord-reply>;

  const isCrossPost = referencedMessage.reference && referencedMessage.reference.guildId !== message.guild?.id;
  const isCommand = referencedMessage.interaction !== null;

  return (
    <discord-reply
      slot="reply"
      edited={!isCommand && referencedMessage.editedAt !== null}
      attachment={referencedMessage.attachments.size > 0}
      author={
        referencedMessage.member?.nickname ?? referencedMessage.author.displayName ?? referencedMessage.author.username
      }
      avatar={referencedMessage.author.avatarURL({ size: 32 }) ?? undefined}
      roleColor={referencedMessage.member?.displayHexColor ?? undefined}
      bot={!isCrossPost && referencedMessage.author.bot}
      verified={referencedMessage.author.flags?.has(UserFlags.VerifiedBot)}
      op={message?.channel?.isThread?.() && referencedMessage.author.id === message?.channel?.ownerId}
      server={isCrossPost ?? undefined}
      command={isCommand}
    >
      {referencedMessage.content ? (
        <span data-goto={referencedMessage.id} className="reply-inline">
          <MessageContent content={referencedMessage.content} context={{ ...context, type: RenderType.REPLY }} />
        </span>
      ) : isCommand ? (
        <em data-goto={referencedMessage.id}>Click to see command.</em>
      ) : (
        <em data-goto={referencedMessage.id}>Click to see attachment.</em>
      )}
    </discord-reply>
  );
}
