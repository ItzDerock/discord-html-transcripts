import { Awaitable, Channel, ChannelType, DMChannel, Message, Role, User } from "discord.js";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { DiscordHeader, DiscordMessages } from "@derockdev/discord-components-react";
import renderMessage from "./renderers/message";
import renderContent, { RenderType } from "./renderers/content";
import { buildProfiles } from "../utils/buildProfiles";
import { scrollToMessage } from "../static/client";

export type RenderMessageContext = {
  messages: Message[];
  channel: Channel;

  callbacks: {
    resolveChannel: (channelId: string) => Awaitable<Channel | null>;
    resolveUser: (userId: string) => Awaitable<User | null>;
    resolveRole: (roleId: string) => Awaitable<Role | null>;
  },

  removePoweredBy?: boolean;
  saveImages: boolean;
};

export default async function renderMessages({
  messages,
  channel,
  callbacks,
  ...options
}: RenderMessageContext) {
  const profiles = buildProfiles(messages);
  const chatBody = [] as React.ReactElement[];

  for (const message of messages) {
    const rendered = await renderMessage(message, {
      messages,
      channel,
      callbacks,
      ...options,
    });

    if (rendered) chatBody.push(rendered);
  }

  const elements = (
    <DiscordMessages>
      {/* header */}
      <DiscordHeader 
        guild={channel.isDMBased() ? 'Direct Messages' : channel.guild.name}
        channel={
          channel.isDMBased() 
            ? channel instanceof DMChannel 
              ? (channel.recipient?.tag ?? 'Unknown Recepient')
              : 'Unknown Recepient'
            : channel.name
        }
        icon={
          channel.isDMBased() 
            ? undefined 
            : channel.guild.iconURL({ size: 128 }) ?? undefined
        }
      >
        {
          channel.isThread()
            ? `Thread channel in ${channel.parent?.name ?? 'Unknown Channel'}`
          : channel.isDMBased()
            ? `Direct Messages`
          : channel.isVoiceBased()
            ? `Voice Text Channel for ${channel.name}`
          : channel.type === ChannelType.GuildCategory
            ? `Category Channel`
          : channel.topic 
            ? await renderContent(channel.topic, { messages, channel, callbacks, type: RenderType.REPLY, ...options })
          : `This is the start of #${channel.name} channel.`
        }
      </DiscordHeader>

      {/* body */}
      {chatBody}

      {/* footer */}
      <div style={{ textAlign: "center", width: "100%" }}>
        Exported {messages.length} message{messages.length > 1 ? 's' : ''}. {
          options.removePoweredBy ? null : (
            <span style={{ textAlign: 'center' }}>
              Powered by <a href="https://github.com/ItzDerock/discord-html-transcripts" style={{ color: 'lightblue' }}>discord-html-transcripts</a>.
            </span>
          )
        }
      </div>
    </DiscordMessages>
  );

  return ReactDOMServer.renderToStaticMarkup(
    <html>
      <head>
        {/* profiles */}
        <script dangerouslySetInnerHTML={
          {
            __html: `window.$discordMessage={profiles:${await profiles}}`
          }
        }></script>

        {/* message reference handler */}
        <script dangerouslySetInnerHTML={{
          __html: scrollToMessage
        }}/>
        
        {/* component library */}
        <script type="module" src="https://unpkg.com/@derockdev/discord-components-core"></script>
      </head>

      <body style={{
        margin: 0,
        minHeight: "100vh"
      }}>
        {elements}
      </body>
    </html>
  );
}