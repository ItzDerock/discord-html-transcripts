import { DiscordBold, DiscordCustomEmoji, DiscordInlineCode, DiscordItalic, DiscordMention, DiscordQuote, DiscordSpoiler, DiscordUnderlined } from '@skyra/discord-components-react';
import parse, { rulesExtended, RuleTypes } from 'discord-markdown-parser';
import React, { Fragment, ReactNode } from 'react';
import { ASTNode, SingleASTNode } from 'simple-markdown';
import { RenderMessageContext } from '../..';

type RenderContentContext = RenderMessageContext & {
  inEmbed: boolean;
}

export default async function renderContent(content: string, context: RenderContentContext) {
  // parse the markdown
  const parsed = parse(content, context.inEmbed ? "extended" : "normal");

  return (
    <Fragment>
      {await renderNodes(parsed, context)}
    </Fragment>
  )
}

const renderNodes = async (nodes: ASTNode, context: RenderContentContext) => Array.isArray(nodes) 
  ? await Promise.all(nodes.map((node) => renderASTNode(node, context))) 
  : [await renderASTNode(nodes, context)];

export async function renderASTNode(node: SingleASTNode, context: RenderContentContext): Promise<ReactNode> {
  const type = node.type as keyof typeof rulesExtended;

  switch (type) {
    case 'text':
      return node.content;

    case 'link':
      return <a href={node.target}>{await renderNodes(node.children, context)}</a>;

    case 'url':
    case 'autolink':
      return (
        <a href={node.target} target="_blank" rel="noreferrer">
          {...(await renderNodes(node.content, context))}
        </a>
      )

    case 'blockQuote':
      return (
        <DiscordQuote>
          {...(await renderNodes(node.content, context))}
        </DiscordQuote>
      )

    case 'br':
    case 'newline':
      return <br />

    case 'channel': {
      const id = node.id as string;
      const channel = await context.callbacks.resolveChannel(id);

      return (
        <DiscordMention
          type={channel ? (
            channel.isTextBased() ? (
              channel.isThread() ? 'thread' : 'channel'
            ) : 'voice'
          ) : 'channel'}
        >
          {
            channel 
              ? channel.isDMBased() 
                ? "DM Channel"
              : channel.name
            : `Unknown Channel (${id})`
          }
        </DiscordMention>
      )
    }

    case 'role': {
      const id = node.id as string;
      const role = await context.callbacks.resolveRole(id);

      return (
        <DiscordMention 
          type="role"
          color={role?.hexColor}
        >
          {role ? role.name : `Unknown Role (${id})`}
        </DiscordMention>
      )
    }

    case 'user': {
      const id = node.id as string;
      const user = await context.callbacks.resolveUser(id);

      return (
        <DiscordMention
          type="user"
        >
          {user ? user.tag : `Unknown User (${id})`}
        </DiscordMention>
      );
    }

    case 'here':
    case 'everyone':
      return (
        <DiscordMention 
          type={'role'}
          highlight
        >
          {type === 'here' ? '@here' : '@everyone'}
        </DiscordMention>
      )

    case 'inlineCode':
      return (
        <DiscordInlineCode>
          {node.content}
        </DiscordInlineCode>
      );

    case 'em':
      return (
        <DiscordItalic>
          {await renderNodes(node.content, context)}
        </DiscordItalic>
      )

    case 'strong':
      return (
        <DiscordBold>
          {await renderNodes(node.content, context)}
        </DiscordBold>
      )
    
    case 'underline': 
      return (
        <DiscordUnderlined>
          {await renderNodes(node.content, context)}
        </DiscordUnderlined>
      )

    case 'strikethrough':
      return (
        <s>
          {await renderNodes(node.content, context)}
        </s>
      )

    case 'emoticon':
      return typeof node.content === 'string' ? node.content : await renderNodes(node.content, context);

    case 'spoiler':
      return (
        <DiscordSpoiler>
          {await renderNodes(node.content, context)}
        </DiscordSpoiler>
      )

    case 'emoji':
      return (
        <DiscordCustomEmoji
          name={node.name as string}
          url={`https://cdn.discordapp.com/emojis/${node.id}.${node.animated ? 'gif' : 'png'}`}
          embedEmoji={context.inEmbed}
        />
      )

    default: {
      console.log(`Unknown node type: ${type}`, node);
      return typeof node.content === 'string' ? node.content : await renderNodes(node.content, context);
    }
  }
}