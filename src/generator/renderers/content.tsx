import parse, { type RuleTypesExtended } from 'discord-markdown-parser';
import { ChannelType, type APIMessageComponentEmoji } from 'discord.js';
import React from 'react';
import type { ASTNode } from 'simple-markdown';
import { ASTNode as MessageASTNodes } from 'simple-markdown';
import type { SingleASTNode } from 'simple-markdown';
import type { RenderMessageContext } from '../';
import { parseDiscordEmoji } from '../../utils/utils';
import { DiscordHighlightedCode } from './components/DiscordHighlightedCode';

export enum RenderType {
  EMBED,
  REPLY,
  NORMAL,
  WEBHOOK,
}

type RenderContentContext = RenderMessageContext & {
  type: RenderType;

  _internal?: {
    largeEmojis?: boolean;
  };
};

/**
 * Renders discord markdown content
 * @param content - The content to render
 * @param context - The context to render the content in
 * @returns
 */
export default async function MessageContent({ content, context }: { content: string; context: RenderContentContext }) {
  if (context.type === RenderType.REPLY && content.length > 180) content = content.slice(0, 180) + '...';

  // parse the markdown
  const parsed = parse(
    content,
    context.type === RenderType.EMBED || context.type === RenderType.WEBHOOK ? 'extended' : 'normal'
  );

  // check if the parsed content is only emojis
  const isOnlyEmojis = parsed.every(
    (node) => ['emoji', 'twemoji'].includes(node.type) || (node.type === 'text' && node.content.trim().length === 0)
  );
  if (isOnlyEmojis) {
    // now check if there are less than or equal to 25 emojis
    const emojis = parsed.filter((node) => ['emoji', 'twemoji'].includes(node.type));
    if (emojis.length <= 25) {
      context._internal = {
        largeEmojis: true,
      };
    }
  }

  return <MessageASTNodes nodes={parsed} context={context} />;
}

// This function can probably be combined into the MessageSingleASTNode function
async function MessageASTNodes({
  nodes,
  context,
}: {
  nodes: ASTNode;
  context: RenderContentContext;
}): Promise<React.JSX.Element> {
  if (Array.isArray(nodes)) {
    return (
      <>
        {nodes.map((node, i) => (
          <MessageSingleASTNode node={node} context={context} key={i} />
        ))}
      </>
    );
  } else {
    return <MessageSingleASTNode node={nodes} context={context} />;
  }
}

export async function MessageSingleASTNode({ node, context }: { node: SingleASTNode; context: RenderContentContext }) {
  if (!node) return null;

  const type = node.type as RuleTypesExtended;

  switch (type) {
    case 'text':
      return node.content;

    case 'link':
      return (
        <discord-link href={node.target}>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-link>
      );

    case 'url':
    case 'autolink':
      return (
        <discord-link href={node.target} target="_blank" rel="noreferrer">
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-link>
      );

    case 'blockQuote':
      if (context.type === RenderType.REPLY) {
        return <MessageASTNodes nodes={node.content} context={context} />;
      }

      return (
        <discord-quote>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-quote>
      );

    case 'br':
    case 'newline':
      if (context.type === RenderType.REPLY) return ' ';
      return <br />;

    case 'channel': {
      const id = node.id as string;
      const channel = await context.callbacks.resolveChannel(id);

      return (
        <discord-mention type={channel ? (channel.isDMBased() ? 'channel' : getChannelType(channel.type)) : 'channel'}>
          {channel ? (channel.isDMBased() ? 'DM Channel' : channel.name) : `<#${id}>`}
        </discord-mention>
      );
    }

    case 'role': {
      const id = node.id as string;
      const role = await context.callbacks.resolveRole(id);

      return (
        <discord-mention type="role" color={context.type === RenderType.REPLY ? undefined : role?.hexColor}>
          {role ? role.name : `<@&${id}>`}
        </discord-mention>
      );
    }

    case 'user': {
      const id = node.id as string;
      const user = await context.callbacks.resolveUser(id);

      return <discord-mention type="user">{user ? (user.displayName ?? user.username) : `<@${id}>`}</discord-mention>;
    }

    case 'here':
    case 'everyone':
      return (
        <discord-mention type={'role'} highlight>
          {`@${type}`}
        </discord-mention>
      );

    case 'codeBlock':
      if (context.type !== RenderType.REPLY) {
        return <DiscordHighlightedCode language={node.lang} content={node.content} />;
      }
      return <discord-code>{node.content}</discord-code>;

    case 'inlineCode':
      return <discord-code>{node.content}</discord-code>;

    case 'em':
      return (
        <discord-italic>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-italic>
      );

    case 'strong':
      return (
        <discord-bold>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-bold>
      );

    case 'underline':
      return (
        <discord-underlined>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-underlined>
      );

    case 'strikethrough':
      return (
        <s>
          <MessageASTNodes nodes={node.content} context={context} />
        </s>
      );

    case 'emoticon':
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodes nodes={node.content} context={context} />
      );

    case 'spoiler':
      return (
        <discord-spoiler>
          <MessageASTNodes nodes={node.content} context={context} />
        </discord-spoiler>
      );

    case 'emoji':
    case 'twemoji':
      return (
        <discord-custom-emoji
          name={node.name}
          url={parseDiscordEmoji(node as APIMessageComponentEmoji)}
          embedEmoji={context.type === RenderType.EMBED}
          jumbo={context._internal?.largeEmojis}
        />
      );

    case 'timestamp':
      // TODO: Make this reactive
      // https://github.com/ItzDerock/discord-components/blob/main/packages/core/src/components/discord-time/discord-time.tsx
      return <discord-time>{new Date(node.timestamp).toISOString()}</discord-time>;
    // return <DiscordTime timestamp={parseInt(node.timestamp) * 1000} format={node.format} />;

    default: {
      console.log(`[discord-html-transcripts] Unknown node type: ${type}`, node);
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodes nodes={node.content} context={context} />
      );
    }
  }
}

export function getChannelType(channelType: ChannelType): 'channel' | 'voice' | 'thread' | 'forum' {
  switch (channelType) {
    case ChannelType.GuildCategory:
    case ChannelType.GuildAnnouncement:
    case ChannelType.GuildText:
    case ChannelType.DM:
    case ChannelType.GroupDM:
    case ChannelType.GuildDirectory:
    case ChannelType.GuildMedia:
      return 'channel';
    case ChannelType.GuildVoice:
    case ChannelType.GuildStageVoice:
      return 'voice';
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
    case ChannelType.AnnouncementThread:
      return 'thread';
    case ChannelType.GuildForum:
      return 'forum';
    default:
      return 'channel';
  }
}
