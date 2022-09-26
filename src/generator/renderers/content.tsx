import {
  DiscordBold,
  DiscordCodeBlock,
  DiscordCustomEmoji,
  DiscordInlineCode,
  DiscordItalic,
  DiscordMention,
  DiscordQuote,
  DiscordSpoiler,
  DiscordUnderlined,
} from '@derockdev/discord-components-react';
import parse, { type rulesExtended } from 'discord-markdown-parser';
import React, { Fragment, type ReactNode } from 'react';
import type { ASTNode, SingleASTNode } from 'simple-markdown';
import type { RenderMessageContext } from '../';

export enum RenderType {
  EMBED,
  REPLY,
  NORMAL,
}

type RenderContentContext = RenderMessageContext & {
  type: RenderType;

  _internal?: {
    largeEmojis?: boolean;
  };
};

export default async function renderContent(content: string, context: RenderContentContext) {
  if (context.type === RenderType.REPLY && content.length > 180) content = content.slice(0, 180) + '...';

  // parse the markdown
  const parsed = parse(content, context.type === RenderType.EMBED ? 'extended' : 'normal');

  // check if the parsed content is only emojis
  const isOnlyEmojis = parsed.every(
    (node) => node.type === 'emoji' || (node.type === 'text' && node.content.trim().length === 0)
  );
  if (isOnlyEmojis) {
    // now check if there are less than 25 emojis
    const emojis = parsed.filter((node) => node.type === 'emoji');
    if (emojis.length <= 25) {
      context._internal = {
        largeEmojis: true,
      };
    }
  }

  return <>{await renderNodes(parsed, context)}</>;
}

const renderNodes = async (nodes: ASTNode, context: RenderContentContext): Promise<React.ReactNode[]> =>
  Array.isArray(nodes)
    ? (await Promise.all(nodes.map((node) => renderASTNode(node, context)))).map((each, i) => (
        <Fragment key={i}>{each}</Fragment>
      ))
    : [await renderASTNode(nodes, context)];

export async function renderASTNode(node: SingleASTNode, context: RenderContentContext): Promise<ReactNode> {
  if (!node) return null;

  const type = node.type as keyof typeof rulesExtended;

  switch (type) {
    case 'text':
      return node.content;

    case 'link':
      return <a href={node.target}>{await renderNodes(node.content, context)}</a>;

    case 'url':
    case 'autolink':
      return (
        <a href={node.target} target="_blank" rel="noreferrer">
          {...await renderNodes(node.content, context)}
        </a>
      );

    case 'blockQuote':
      if (context.type === RenderType.REPLY) {
        return await renderNodes(node.content, context);
      }

      return <DiscordQuote>{...await renderNodes(node.content, context)}</DiscordQuote>;

    case 'br':
    case 'newline':
      if (context.type === RenderType.REPLY) return ' ';
      return <br />;

    case 'channel': {
      const id = node.id as string;
      const channel = await context.callbacks.resolveChannel(id);

      return (
        <DiscordMention
          type={channel ? (channel.isTextBased() ? (channel.isThread() ? 'thread' : 'channel') : 'voice') : 'channel'}
        >
          {channel ? (channel.isDMBased() ? 'DM Channel' : channel.name) : `Unknown Channel (${id})`}
        </DiscordMention>
      );
    }

    case 'role': {
      const id = node.id as string;
      const role = await context.callbacks.resolveRole(id);

      return (
        <DiscordMention type="role" color={context.type === RenderType.REPLY ? undefined : role?.hexColor}>
          {role ? role.name : `Unknown Role (${id})`}
        </DiscordMention>
      );
    }

    case 'user': {
      const id = node.id as string;
      const user = await context.callbacks.resolveUser(id);

      return <DiscordMention type="user">{user ? user.tag : `Unknown User (${id})`}</DiscordMention>;
    }

    case 'here':
    case 'everyone':
      return (
        <DiscordMention type={'role'} highlight>
          {type === 'here' ? '@here' : '@everyone'}
        </DiscordMention>
      );

    case 'codeBlock':
      if (context.type !== RenderType.REPLY) {
        return <DiscordCodeBlock language={node.lang} code={node.content} />;
      } else {
        return <DiscordInlineCode>{node.content}</DiscordInlineCode>;
      }

    case 'inlineCode':
      return <DiscordInlineCode>{node.content}</DiscordInlineCode>;

    case 'em':
      return <DiscordItalic>{await renderNodes(node.content, context)}</DiscordItalic>;

    case 'strong':
      return <DiscordBold>{await renderNodes(node.content, context)}</DiscordBold>;

    case 'underline':
      return <DiscordUnderlined>{await renderNodes(node.content, context)}</DiscordUnderlined>;

    case 'strikethrough':
      return <s>{await renderNodes(node.content, context)}</s>;

    case 'emoticon':
      return typeof node.content === 'string' ? node.content : await renderNodes(node.content, context);

    case 'spoiler':
      return <DiscordSpoiler>{await renderNodes(node.content, context)}</DiscordSpoiler>;

    case 'emoji':
      return (
        <DiscordCustomEmoji
          name={node.name as string}
          url={`https://cdn.discordapp.com/emojis/${node.id}.${node.animated ? 'gif' : 'png'}`}
          embedEmoji={context.type === RenderType.EMBED}
          largeEmoji={context._internal?.largeEmojis}
        />
      );

    default: {
      console.log(`Unknown node type: ${type}`, node);
      return typeof node.content === 'string' ? node.content : await renderNodes(node.content, context);
    }
  }
}
