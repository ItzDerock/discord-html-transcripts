import { ChannelType, type Awaitable, type Channel, type Message, type Role, type User } from 'discord.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { DiscordHeader, DiscordMessages } from '@derockdev/discord-components-react';
import renderMessage from './renderers/message';
import renderContent, { RenderType } from './renderers/content';
import { buildProfiles } from '../utils/buildProfiles';
import { scrollToMessage } from '../static/client';
import { readFileSync } from 'fs';
import path from 'path';

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = "^3.5.0";

try {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
  discordComponentsVersion = packageJSON.dependencies['@derockdev/discord-components-core'] ?? discordComponentsVersion;
  // eslint-disable-next-line no-empty
} catch {} // ignore errors

export type RenderMessageContext = {
  messages: Message[];
  channel: Channel;

  callbacks: {
    resolveChannel: (channelId: string) => Awaitable<Channel | null>;
    resolveUser: (userId: string) => Awaitable<User | null>;
    resolveRole: (roleId: string) => Awaitable<Role | null>;
  };

  poweredBy?: boolean;
  saveImages: boolean;
  favicon: 'guild' | string;
};

export default async function renderMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const profiles = buildProfiles(messages);
  const chatBody: React.ReactElement[] = [];

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
    <DiscordMessages style={{ minHeight: '100vh' }}>
      {/* header */}
      <DiscordHeader
        guild={channel.isDMBased() ? 'Direct Messages' : channel.guild.name}
        channel={
          channel.isDMBased()
            ? channel.type === ChannelType.DM
              ? channel.recipient?.tag ?? 'Unknown Recipient'
              : 'Unknown Recipient'
            : channel.name
        }
        icon={channel.isDMBased() ? undefined : channel.guild.iconURL({ size: 128 }) ?? undefined}
      >
        {channel.isThread()
          ? `Thread channel in ${channel.parent?.name ?? 'Unknown Channel'}`
          : channel.isDMBased()
          ? `Direct Messages`
          : channel.isVoiceBased()
          ? `Voice Text Channel for ${channel.name}`
          : channel.type === ChannelType.GuildCategory
          ? `Category Channel`
          : 'topic' in channel && channel.topic
          ? await renderContent(channel.topic, { messages, channel, callbacks, type: RenderType.REPLY, ...options })
          : `This is the start of #${channel.name} channel.`}
      </DiscordHeader>

      {/* body */}
      {chatBody}

      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        Exported {messages.length} message{messages.length > 1 ? 's' : ''}.{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            Powered by{' '}
            <a href="https://github.com/ItzDerock/discord-html-transcripts" style={{ color: 'lightblue' }}>
              discord-html-transcripts
            </a>
            .
          </span>
        ) : null}
      </div>
    </DiscordMessages>
  );

  return ReactDOMServer.renderToStaticMarkup(
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />

        {/* favicon */}
        <link
          rel="icon"
          type="image/png"
          href={
            options.favicon === 'guild'
              ? channel.isDMBased()
                ? undefined
                : channel.guild.iconURL({ size: 16, extension: 'png' }) ?? undefined
              : options.favicon
          }
        />

        {/* title */}
        <title>{channel.isDMBased() ? 'Direct Messages' : channel.name}</title>

        {/* profiles */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$discordMessage={profiles:${await profiles}}`,
          }}
        ></script>

        {/* message reference handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: scrollToMessage,
          }}
        />

        {/* component library */}
        <script type="module" src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}></script>
      </head>

      <body
        style={{
          margin: 0,
          minHeight: '100vh',
        }}
      >
        {elements}
      </body>
    </html>
  );
}
