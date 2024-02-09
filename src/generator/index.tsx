import { ChannelType, type Awaitable, type Channel, type Message, type Role, type User } from 'discord.js';
import ReactDOMServer from 'react-dom/server';
import React, { Suspense } from 'react';
import { DiscordHeader, DiscordMessages } from '@derockdev/discord-components-react';
import DiscordMessage from './renderers/message';
import MessageContent, { RenderType } from './renderers/content';
import { buildProfiles } from '../utils/buildProfiles';
import { revealSpoiler, scrollToMessage } from '../static/client';
import { readFileSync } from 'fs';
import path from 'path';
import { renderToString } from '@derockdev/discord-components-core/hydrate';
import { streamToString } from '../utils/utils';

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.6.1';

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
  footerText?: string;
  saveImages: boolean;
  favicon: 'guild' | string;
  hydrate: boolean;
};

export default async function Messages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const profiles = buildProfiles(messages);

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
        {channel.isThread() ? (
          `Thread channel in ${channel.parent?.name ?? 'Unknown Channel'}`
        ) : channel.isDMBased() ? (
          `Direct Messages`
        ) : channel.isVoiceBased() ? (
          `Voice Text Channel for ${channel.name}`
        ) : channel.type === ChannelType.GuildCategory ? (
          `Category Channel`
        ) : 'topic' in channel && channel.topic ? (
          <MessageContent
            content={channel.topic}
            context={{ messages, channel, callbacks, type: RenderType.REPLY, ...options }}
          />
        ) : (
          `This is the start of #${channel.name} channel.`
        )}
      </DiscordHeader>

      {/* body */}
      <Suspense>
        {messages.map((message) => (
          <DiscordMessage message={message} context={{ messages, channel, callbacks, ...options }} key={message.id} />
        ))}
      </Suspense>

      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replace('{s}', messages.length > 1 ? 's' : '')
          : `Exported ${messages.length} message${messages.length > 1 ? 's' : ''}.`}{' '}
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

  // NOTE: this renders a STATIC site with no interactivity
  // if interactivity is needed, switch to renderToPipeableStream and use hydrateRoot on client.
  const stream = ReactDOMServer.renderToStaticNodeStream(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

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

        {/* message reference handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: scrollToMessage,
          }}
        />

        {!options.hydrate && (
          <>
            {/* profiles */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.$discordMessage={profiles:${JSON.stringify(await profiles)}}`,
              }}
            ></script>
            {/* component library */}
            <script
              type="module"
              src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
            ></script>
          </>
        )}
      </head>

      <body
        style={{
          margin: 0,
          minHeight: '100vh',
        }}
      >
        {elements}
      </body>

      {/* Make sure the script runs after the DOM has loaded */}
      {options.hydrate && <script dangerouslySetInnerHTML={{ __html: revealSpoiler }}></script>}
    </html>
  );

  const markup = await streamToString(stream);

  if (options.hydrate) {
    const result = await renderToString(markup, {
      beforeHydrate: async (document) => {
        document.defaultView.$discordMessage = {
          profiles: await profiles,
        };
      },
    });

    return result.html;
  }

  return markup;
}
