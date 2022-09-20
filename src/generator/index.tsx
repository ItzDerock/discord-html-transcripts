import { Awaitable, Channel, Emoji, Message, Role, User } from "discord.js";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { DiscordMessages } from "@skyra/discord-components-react";
import renderMessage from "./renderers/message";

export type RenderMessageContext = {
  messages: Message[];
  channel: Channel;

  callbacks: {
    resolveChannel: (channelId: string) => Awaitable<Channel | null>;
    resolveUser: (userId: string) => Awaitable<User | null>;
    resolveRole: (roleId: string) => Awaitable<Role | null>;
  }
};

export default async function renderMessages({
  messages,
  channel,
  callbacks
}: RenderMessageContext) {
  const elements = (
    <DiscordMessages>
        {await Promise.all(messages.map(
          (message) => renderMessage(message, { messages, channel, callbacks })
        ))}
    </DiscordMessages>
  );

  return ReactDOMServer.renderToStaticMarkup(
    <html>
      <head>
        <script type="module" src="https://unpkg.com/@skyra/discord-components-core"></script>
      </head>

      <body>
        {elements}
      </body>
    </html>
  );
}