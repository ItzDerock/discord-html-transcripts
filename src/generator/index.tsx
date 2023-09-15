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

const AvailableLanguages = [
"ENGLISH", "BRAZILIAN"
] 
// Check if the language is correct
 // Define the variables and then add content
 let TSCREATEDATE = "" 
 let TitleThread = ""
 let TitleDM = ""
 let TitleDM1 = ""
 let TitleVC = ""
 let TitleCT = ""
 let TitleCT1 = ""
 let TitleCH = ""
 let TitleCH1 = ""
 let Footer0 = ""
 let Footer1 = ""
 let Footer2 = ""

 

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.5.0';

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
  customCSS: {
    Primary?:  any;
    TextTheme?: | any;
  }; // I work on custom css later for now, ill add 2 simple little settings.
  poweredBy?: boolean;
  useNewCSS?: boolean;
  footerText?: string;
  headerText?: string;
  headerColor?: string;
  Language?: string;
  saveImages: boolean;
  favicon: 'guild' | string;
};

export default async function renderMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  
  // Languages - Ill move this to a different file soon
  if(AvailableLanguages.includes(options.Language?.toUpperCase() || "ENGLISH") && options.Language?.toUpperCase() == "ENGLISH"){
    TSCREATEDATE = "Transcript created on " 
    TitleThread = "Thread channel in "
    TitleDM = "Direct Messages"
    TitleDM1 = "Unknown Recipient"
    TitleVC = "Voice Text Channel for "
    TitleCT = "Category Channel"
    TitleCT1 = "Topic"
    TitleCH = "The start of #"
    TitleCH1 = "Unknown Channel"
    Footer0 = "Exported"
    Footer1 = "message"
    Footer2 = "Powered by"

  } else if(AvailableLanguages.includes(options.Language?.toUpperCase() || "ENGLISH") && options.Language?.toUpperCase() == "BRAZILIAN"){
    TSCREATEDATE = "Transcrição criada em " 
    TitleThread = "Canal de rosca em "
    TitleDM = "Mensagens diretas"
    TitleDM1 = "Destinatário desconhecido"
    TitleVC = "Canal de texto de voz para "
    TitleCT = "Canal da categoria"
    TitleCT1 = "Tópico"
    TitleCH = "Isso é o começo do canal #"
    TitleCH1 = "Canal desconhecido"
    Footer0 = "Exportado"
    Footer1 = "mensagem"
    Footer2 = "Desenvolvido por"
  }

  const profiles = buildProfiles(messages);
  const chatBody: React.ReactElement[] = [];

  if(!AvailableLanguages.includes(options.Language?.toUpperCase() || "English")){
    console.error(`[Discord-Html-Transcripts | Language Error] Seems like your following language you typed (${options.Language}) in is invalid or not found. \n This are the following languages available (${AvailableLanguages}). \n I will now quit as a proper language is required!`);
    process.exit(0);
  }
  if(options.customCSS && !options.useNewCSS){
    console.warn(`[Discord-Html-Transcripts | Configuration Warning] Seems like you want to add some custom css but that isn't possible if the new css is enabled.`)
  }

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
      <style>
        {options.useNewCSS
          ? `@import url('https://fonts.bunny.net/css?family=roboto:400,500,700');
@font-face {
  font-family:'Whitney';
  src:url('https://cdn.jsdelivr.net/gh/ItzDerock/discord-components@master/assets/fonts/Book.woff') format('woff');
  font-weight:400;
  font-display:swap
}
@font-face {
  font-family:'Whitney';
  src:url('https://cdn.jsdelivr.net/gh/ItzDerock/discord-components@master/assets/fonts/Medium.woff') format('woff');
  font-weight:500;
  font-display:swap
}
@font-face {
  font-family:'Whitney';
  src:url('https://cdn.jsdelivr.net/gh/ItzDerock/discord-components@master/assets/fonts/Semibold.woff') format('woff');
  font-weight:600;
  font-display:swap
}
@font-face {
  font-family:'Whitney';
  src:url('https://cdn.jsdelivr.net/gh/ItzDerock/discord-components@master/assets/fonts/Bold.woff') format('woff');
  font-weight:700;
  font-display:swap
}
.discord-messages {
  color: ${options.customCSS.TextTheme || "#afafaf"};
  background-color: ${options.customCSS.Primary || "#1a1818"};
  display:block;
  font-size:16px;
  font-family:Whitney, 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, 'system-ui', 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  line-height:170%;
  border:5px solid rgba(0, 0, 0, 0.05);
}
.discord-messages.discord-light-theme {
  color:#747f8d;
  background-color:#fff;
  border-color:#dedede
}
.discord-messages.discord-no-background {
  background-color:unset
}
.discord-header {
  display:flex;
  flex-direction:row;
  max-height:5rem;
  padding:0.5rem;
  gap:0.5rem;
  border-bottom:1px solid rgba(79, 84, 92, 0.48)
}
.discord-header-icon {
  float:left;
  width:5rem
}
.discord-header-icon>div {
  background-color:rgb(79, 84, 92);
  border-radius:50%;
  width:5rem;
  height:5rem;
  text-align:center;
  align-items:center;
  justify-content:center;
  display:flex;
  font-size:xx-large
}
.discord-header-icon>img {
  border-radius:50%;
  width:auto;
  height:100%
}
.discord-header-text {
  flex-grow:1
}
.discord-header-text-guild {
  font-size:1.5rem;
  font-weight:bold;
  font-style: italic;
}.discord-message {
  color: ${options.customCSS.TextTheme || "#dcddde"};
  display:flex;
  flex-direction:column;
  font-size:0.9em;
  font-family:Whitney, 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, 'system-ui', 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  padding:0px 1em;
  position:relative;
  word-wrap:break-word;
 -webkit-user-select:text;
  -moz-user-select:text;
  -ms-user-select:text;
  user-select:text;
  -webkit-box-flex:0;
  -ms-flex:0 0 auto;
  flex:0 0 auto;
  padding-right:0;
  min-height:1.375rem;
  padding-right:48px !important;
  margin-top:1.0625rem
}
.discord-message .discord-message-inner {
  display:flex;
  position:relative;
  -webkit-box-flex:0;
  -ms-flex:0 0 auto;
  flex:0 0 auto
}
.discord-message.discord-highlight-mention,
.discord-message.discord-highlight-ephemeral {
  padding-right:5px;
  position:relative
}
.discord-message.discord-highlight-mention::before,
.discord-message.discord-highlight-ephemeral::before {
  content:'';
  position:absolute;
  display:block;
  top:0;
  left:0;
  bottom:0;
  pointer-events:none;
  width:2px
}
.discord-message.discord-highlight-mention {
  background-color:rgba(250, 166, 26, 0.1)
}
.discord-light-theme .discord-message.discord-highlight-mention {
  background-color:rgba(250, 166, 26, 0.1)
}
.discord-message.discord-highlight-mention:hover {
  background-color:rgba(250, 166, 26, 0.08)
}
.discord-light-theme .discord-message.discord-highlight-mention:hover {
  background-color:rgba(250, 166, 26, 0.2)
}
.discord-message.discord-highlight-mention::before {
  background-color:#faa61a
}
.discord-message.discord-highlight-ephemeral {
  background-color:rgba(88, 101, 242, 0.05)
}
.discord-light-theme .discord-message.discord-highlight-ephemeral {
  background-color:rgba(250, 166, 26, 0.1)
}
.discord-message.discord-highlight-ephemeral:hover {
  background-color:rgba(88, 101, 242, 0.1)
}
.discord-message.discord-highlight-ephemeral::before {
  background-color:#5865f2
}
.discord-light-theme .discord-message {
  color:#2e3338;
  border-color:#eceeef
}
.discord-message a {
  color:#00aff4;
  font-weight:normal;
  text-decoration:none
}
.discord-message a:hover {
  text-decoration:underline
}
.discord-light-theme .discord-message a {
  color:#00b0f4
}
.discord-message a:hover {
  text-decoration:underline
}
.discord-message .discord-author-avatar {
  margin-right:16px;
  margin-top:5px;
  min-width:40px;
  z-index:1
}
.discord-message .discord-author-avatar img {
  width:40px;
  height:40px;
  border-radius:50%
}
.discord-message .discord-message-timestamp {
  color:#72767d;
  font-size:12px;
  margin-left:3px
}
.discord-light-theme .discord-message .discord-message-timestamp {
  color:#747f8d
}
.discord-message .discord-message-edited {
  color:#72767d;
  font-size:10px
}
.discord-light-theme .discord-message .discord-message-edited {
  color:#99aab5
}
.discord-message .discord-message-content {
  width:100%;
  line-height:160%;
  font-weight:normal;
  padding-top:2px
}
.discord-message .discord-message-body {
  font-size:1rem;
  font-weight:400;
  word-break:break-word;
  position:relative
}
.discord-message .discord-message-body strong {
  font-weight:700
}
.discord-message .discord-message-body em {
  font-style:italic
}
.discord-message .discord-message-body u {
  text-decoration-color:rgb(220, 221, 222);
  text-decoration-line:underline;
  text-decoration-style:solid;
  text-decoration-thickness:auto
}
.discord-message .discord-message-body pre {
  border:1px solid #202225;
  border-radius:4px
}
.discord-message .discord-message-body code {
  background:#2f3136;
  white-space:break-spaces;
  font-family:Consolas, Andale Mono WT, Andale Mono, Lucida Console, Lucida Sans Typewriter, DejaVu Sans Mono, Bitstream Vera Sans Mono,
    Liberation Mono, Nimbus Mono L, Monaco, Courier New, Courier, monospace
}
.discord-light-theme .discord-message .discord-message-timestamp,
.discord-compact-mode .discord-message:hover .discord-message-timestamp,
.discord-compact-mode.discord-light-theme .discord-message:hover .discord-message-timestamp {
  color:#99aab5
}
.discord-compact-mode.discord-light-theme .discord-message .discord-message-timestamp {
  color:#d1d9de
}
.discord-compact-mode .discord-message .discord-message-timestamp {
  display:inline-block;
  width:3.1rem;
  text-align:right;
  font-size:0.6875rem;
  line-height:1.375rem;
  margin-right:0.25rem;
  margin-left:0;
  text-indent:0
}
.discord-compact-mode .discord-message {
  margin-top:unset
}
.discord-compact-mode .discord-message .discord-message-body {
  line-height:1.375rem;
  padding-left:10px;
  text-indent:-6px
}
.discord-compact-mode .discord-message .discord-message-compact-indent {
  padding-left:10px
}
.discord-message:first-child {
  margin-top:0.5rem
}
.discord-message:last-child {
  margin-bottom:0.5rem;
  border-bottom-width:0
}
.discord-message .discord-message-markup {
  font-size:1rem;
  line-height:1.375rem;
  word-wrap:break-word;
  user-select:text;
  font-weight:400
}
.discord-compact-mode .discord-author-avatar {
  display:none
}
.discord-message:hover {
  background-color:rgba(4, 4, 5, 0.07)
}
.discord-light-theme .discord-message:hover {
  background-color:rgba(6, 6, 7, 0.02)
}
.discord-message.discord-message-has-thread:after {
  width:2rem;
  left:2.2rem;
  top:1.75rem;
  border-left:2px solid #4f545c;
  border-bottom:2px solid #4f545c;
  border-bottom-left-radius:8px;
  bottom:29px;
  content:'';
  position:absolute
}
.discord-light-theme .discord-message.discord-message-has-thread:after {
  border-color:#747f8d
}
.discord-message-ephemeral {
  color:#72767d;
  margin-top:4px;
  font-size:12px;
  font-weight:400;
  color:#72767d
}
.discord-light-theme .discord-message-ephemeral {
  color:#747f8d
}
.discord-message-ephemeral .discord-message-ephemeral-link {
  color:#00aff4;
  font-weight:500;
  cursor:pointer
}
.discord-message-ephemeral .discord-message-ephemeral-link:hover {
  text-decoration:underline
}
.discord-message-ephemeral .discord-message-ephemeral-icon {
  margin-right:4px;
  vertical-align:text-bottom
}
.discord-message .discord-author-info {
  display:inline-flex;
  align-items:center;
  font-size:16px;
  margin-right:0.25rem
}
.discord-compact-mode .discord-message .discord-author-info {
  margin-right:0
}
.discord-message .discord-author-info .discord-author-username {
  color:#fff;
  font-size:1em;
  font-weight:500
}
.discord-light-theme .discord-message .discord-author-info .discord-author-username {
  color:#23262a
}
.discord-message .discord-author-info .discord-application-tag {
  background-color:#5865f2;
  color:#fff;
  font-size:0.625em;
  margin-left:4px;
  border-radius:3px;
  line-height:100%;
  text-transform:uppercase;
  display:flex;
  align-items:center;
  height:0.9375rem;
  padding:0 0.275rem;
  margin-top:0.075em;
  border-radius:0.1875rem
}
.discord-message .discord-author-info .discord-application-tag.discord-application-tag-op {
  background-color:#c9cdfb;
  color:#4752c4;
  border-radius:0.4rem
}
.discord-message .discord-author-info .discord-application-tag-verified {
  display:inline-block;
  width:0.9375rem;
  height:0.9375rem;
  margin-left:-0.25rem
}
.discord-message .discord-author-info .discord-author-role-icon {
  margin-left:0.25rem;
  vertical-align:top;
  height:calc(1rem + 4px);
  width:calc(1rem + 4px)
}
.discord-compact-mode .discord-message .discord-author-info .discord-author-username {
  margin-left:8px;
  margin-right:4px
}
.discord-compact-mode .discord-message .discord-author-info .discord-application-tag {
  margin-left:0;
  margin-left:5px;
  margin-right:5px;
  padding-left:10px;
  padding-right:4px
}
.discord-compact-mode .discord-message .discord-author-info .discord-application-tag-verified {
  margin-right:0.7em;
  margin-left:-0.7em
}
.discord-message .discord-attachments {
  display:grid;
  grid-auto-flow:row;
  grid-row-gap:0.25rem;
  text-indent:0;
  min-height:0;
  min-width:0;
  padding-top:0.125rem;
  padding-bottom:0.125rem;
  position:relative
}
.discord-message .discord-attachments>* {
  justify-self:start;
  -ms-flex-item-align:start;
  align-self:start
}
.discord-embed {
  color:#dcddde;
  display:flex;
  font-size:13px;
  line-height:150%;
  margin-bottom:2px;
  margin-top:2px
}
.discord-light-theme .discord-embed {
  color:#2e3338
}
.discord-embed .discord-left-border {
  background-color:#202225;
  border-radius:4px 0 0 4px;
  flex-shrink:0;
  width:4px
}
.discord-light-theme .discord-embed .discord-left-border {
  background-color:#e3e5e8
}
.discord-embed .discord-embed-root {
  display:grid;
  grid-auto-flow:row;
  grid-row-gap:0.25rem;
  min-height:0;
  min-width:0;
  text-indent:0
}
.discord-embed .discord-embed-wrapper {
  background-color:#2f3136;
  max-width:520px;
  border:1px solid rgba(46, 48, 54, 0.6);
  border-radius:0 4px 4px 0;
  justify-self:start;
  align-self:start;
  display:grid;
  box-sizing:border-box
}
.discord-light-theme .discord-embed .discord-embed-wrapper {
  background-color:rgba(249, 249, 249, 0.3);
  border-color:rgba(205, 205, 205, 0.3)
}
.discord-embed .discord-embed-wrapper .discord-embed-grid {
  display:inline-grid;
  grid-template-columns:auto -webkit-min-content;
  grid-template-columns:auto min-content;
  grid-template-columns:auto;
  grid-template-rows:auto;
  padding:0.5rem 1rem 1rem 0.75rem
}
.discord-embed .discord-embed-thumbnail {
  border-radius:4px;
  flex-shrink:0;
  grid-column:2/2;
  grid-row:1/8;
  justify-self:end;
  margin-left:16px;
  margin-top:8px;
  max-height:80px;
  max-width:80px;
  object-fit:contain;
  object-position:top center
}
.discord-embed .discord-embed-author {
  -webkit-box-align:center;
  align-items:center;
  color: ${options.customCSS.TextTheme || "#fff"};
  font-size:14px;
  display:flex;
  font-weight:600;
  grid-column:1 / 1;
  margin-top:8px;
  min-width:0
}
.discord-light-theme .discord-embed .discord-embed-author {
  color:#4f545c
}
.discord-embed .discord-embed-author a {
  color:#fff;
  font-weight:600
}
.discord-light-theme .discord-embed .discord-embed-author a {
  color:#4f545c
}
.discord-embed .discord-embed-author .discord-author-image {
  border-radius:50%;
  height:24px;
  margin-right:8px;
  width:24px
}
.discord-embed .discord-embed-provider {
  font-size:0.75rem;
  line-height:1rem;
  font-weight:400;
  grid-column:1/1;
  margin-top:8px;
  unicode-bidi:plaintext;
  text-align:left
}
.discord-light-theme .discord-embed .discord-embed-provider {
  color:#4f545c
}
.discord-embed .discord-embed-title {
  -webkit-box-align:center;
  align-items:center;
  color:#fff;
  display:inline-block;
  font-size:1rem;
  font-weight:600;
  grid-column:1 / 1;
  margin-top:8px;
  min-width:0
}
.discord-embed .discord-embed-title a {
  color:#00aff4;
  font-weight:600
}
.discord-embed .discord-embed-image {
  border-radius:4px;
  max-width:100%
}
.discord-embed .discord-embed-media {
  border-radius:4px;
  contain:paint;
  display:block;
  grid-column:1/1;
  margin-top:16px
}
.discord-embed .discord-embed-media.discord-embed-media-video {
  height:225px
}
.discord-embed .discord-embed.media .discord-embed-image {
  overflow:hidden;
  position:relative;
  user-select:text
}
.discord-embed .discord-embed-media .discord-embed-video {
  -webkit-box-align:center;
  -webkit-box-pack:center;
  align-items:center;
  border-radius:0;
  cursor:pointer;
  display:flex;
  height:100%;
  justify-content:center;
  max-height:100%;
  width:100%;
  width:400px;
  height:225px;
  left:0px;
  top:0px
}
.discord-embed-custom-emoji {
  display:inline-block
}
.discord-embed-custom-emoji .discord-embed-custom-emoji-image {
  width:18px;
  height:18px;
  vertical-align:bottom
}
.discord-message .discord-mention {
  color:#e3e3e3;
  background-color:hsla(235, 85.6%, 64.7%, 0.3);
  font-weight:500;
  padding:0 2px;
  border-radius:3px;
  unicode-bidi:-moz-plaintext;
  unicode-bidi:plaintext;
  -webkit-transition:background-color 50ms ease-out, color 50ms ease-out;
  transition:background-color 50ms ease-out, color 50ms ease-out;
  cursor:pointer
}
.discord-message .discord-mention:hover {
  color:#fff;
  background-color:hsl(235, 85.6%, 64.7%)
}
.discord-message .discord-mention.discord-channel-mention {
  padding-left:1.2rem !important;
  position:relative
}
.discord-message .discord-mention.discord-voice-mention,
.discord-message .discord-mention.discord-locked-mention,
.discord-message .discord-mention.discord-thread-mention,
.discord-message .discord-mention.discord-forum-mention {
  padding-left:1.25rem !important;
  position:relative
}
.discord-light-theme .discord-message .discord-mention {
  color:#687dc6;
  background-color:hsla(235, 85.6%, 64.7%, 0.15)
}
.discord-light-theme .discord-message .discord-mention:hover {
  color:#ffffff;
  background-color:hsl(235, 85.6%, 64.7%)
}
.discord-message .discord-mention .discord-mention-icon {
  width:1rem;
  height:1rem;
  object-fit:contain;
  position:absolute;
  left:0.125rem;
  top:0.125rem
}
.discord-replied-message {
  color:#b9bbbe;
  display:flex;
  font-size:0.875rem;
  font-family:Whitney, 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, 'system-ui', 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  padding-top:2px;
  margin-left:56px;
  margin-bottom:4px;
  align-items:center;
  /*! line-height:1.125rem; */
  position:relative;
  white-space:pre;
  user-select:none
}
.discord-light-theme .discord-replied-message {
  color:#4f5660
}
.discord-compact-mode .discord-replied-message {
  margin-left:62px;
  margin-bottom:0
}
.discord-replied-message:before {
  content:'';
  display:block;
  position:absolute;
  top:50%;
  right:100%;
  bottom:0;
  left:-36px;
  margin-right:4px;
  margin-top:-1px;
  margin-left:-1px;
  margin-bottom:-2px;
  border-left:2px solid #4f545c;
  border-bottom:0 solid #4f545c;
  border-right:0 solid #4f545c;
  border-top:2px solid #4f545c;
  border-top-left-radius:6px
}
.discord-light-theme .discord-replied-message:before {
  border-color:#747f8d
}
.discord-replied-message .discord-replied-message-avatar,
.discord-replied-message .discord-reply-badge {
  -webkit-box-flex:0;
  -ms-flex:0 0 auto;
  flex:0 0 auto;
  width:16px;
  height:16px;
  border-radius:50%;
  user-select:none;
  margin-right:0.25rem
}
.discord-replied-message .discord-reply-badge {
  display:flex;
  align-items:center;
  justify-content:center;
  color:#b9bbbe;
  background:#202225
}
.discord-light-theme .discord-replied-message .discord-reply-badge {
  color:#4f5660;
  background:#e3e5e8
}
.discord-replied-message .discord-application-tag {
  background-color:hsl(235, 85.6%, 64.7%);
  color:#fff;
  font-size:0.625rem;
  margin-right:0.25rem;
  line-height:100%;
  text-transform:uppercase;
  display:flex;
  align-items:center;
  height:0.9375rem;
  padding:0 0.275rem;
  margin-top:0.075em;
  border-radius:0.1875rem
}
.discord-replied-message .discord-application-tag .discord-application-tag-verified {
  width:0.9375rem;
  height:0.9375rem;
  margin-left:-0.1rem
}
.discord-replied-message .discord-application-tag.discord-application-tag-op {
  background-color:#c9cdfb;
  color:#4752c4;
  border-radius:0.4rem
}
.discord-replied-message .discord-replied-message-username {
  flex-shrink:0;
  font-size:inherit;
  line-height:inherit;
  margin-right:0.25rem;
  opacity:0.64;
  font-weight:500;
  color:#fff
}
.discord-replied-message .discord-replied-message-content {
  color:inherit;
  font-size:inherit;
  line-height:inherit;
  white-space:pre;
  text-overflow:ellipsis;
  user-select:none;
  cursor:pointer;
  overflow-x:hidden
}
.discord-replied-message .discord-replied-message-content:hover {
  color:#fff;
}
.discord-light-theme .discord-replied-message .discord-replied-message-content:hover {
  color:#000
}
.discord-replied-message .discord-replied-message-content .discord-message-edited {
  margin-left:0.25rem
}
.discord-replied-message .discord-replied-message-content-icon {
  -webkit-box-flex:0;
  -ms-flex:0 0 auto;
  flex:0 0 auto;
  width:20px;
  height:20px;
  margin-left:4px
}
.discord-message .discord-author-info {
  display:inline-flex;
  align-items:center;
  font-size:16px;
  margin-right:0.25rem
}
.discord-compact-mode .discord-message .discord-author-info {
  margin-right:0
}
.discord-message .discord-author-info .discord-author-username {
  color:#fff;
  font-size:1em;
  font-weight:500
}
.discord-light-theme .discord-message .discord-author-info .discord-author-username {
  color:#23262a
}
.discord-message .discord-author-info .discord-application-tag {
  background-color:#5865f2;
  color: ${options.customCSS.TextTheme || "#fff"};
  font-size:0.625em;
  margin-left:4px;
  border-radius:3px;
  line-height:100%;
  text-transform:uppercase;
  display:flex;
  align-items:center;
  height:0.9375rem;
  padding:0 0.275rem;
  margin-top:0.075em;
  border-radius:0.1875rem
}
.discord-message .discord-author-info .discord-application-tag.discord-application-tag-op {
  background-color:#c9cdfb;
  color:#4752c4;
  border-radius:0.4rem
}
.discord-message .discord-author-info .discord-application-tag-verified {
  display:inline-block;
  width:0.9375rem;
  height:0.9375rem;
  margin-left:-0.25rem
}
.discord-message .discord-author-info .discord-author-role-icon {
  margin-left:0.25rem;
  vertical-align:top;
  height:calc(1rem + 4px);
  width:calc(1rem + 4px)
}
.discord-compact-mode .discord-message .discord-author-info .discord-author-username {
  margin-left:8px;
  margin-right:4px
}
.discord-compact-mode .discord-message .discord-author-info .discord-application-tag {
  margin-left:0;
  margin-left:5px;
  margin-right:5px;
  padding-left:10px;
  padding-right:4px
}
.discord-compact-mode .discord-message .discord-author-info .discord-application-tag-verified {
  margin-right:0.7em;
  margin-left:-0.7em
}
.discord-action-row {
  display:flex;
  flex-wrap:nowrap
}
.discord-embed .discord-embed-description {
  font-size:0.875rem;
  font-weight:400;
  grid-column:1/1;
  line-height:1.125rem;
  margin-top:8px;
  min-width:0;
  white-space:pre-line
}
.discord-embed .discord-embed-description pre {
  margin:0;
  margin-top:6px
}
.discord-embed .discord-embed-description img.emoji {
  width:22px;
  height:22px
}
.discord-embed .discord-embed-description blockquote {
  position:relative;
  padding:0 8px 0 12px;
  margin:0
}
.discord-embed .discord-embed-description blockquote::before {
  content:'';
  display:block;
  position:absolute;
  left:0;
  height:100%;
  width:4px;
  border-radius:4px;
  background-color:#4f545c
}
.discord-light-theme .discord-embed-description blockquote::before {
  background-color:#c7ccd1
}
.discord-embed .discord-embed-description .spoiler {
  background-color:#202225;
  color:transparent;
  cursor:pointer
}
.discord-light-theme .discord-embed .discord-embed-description .spoiler {
  background-color:#b9bbbe
}
.discord-embed .discord-embed-description .spoiler:hover {
  background-color:rgba(32, 34, 37, 0.8)
}
.discord-light-theme .discord-embed .discord-embed-description .spoiler:hover {
  background-color:rgba(185, 187, 190, 0.8)
}
.discord-embed .discord-embed-description .spoiler:active {
  color:inherit;
  background-color:hsla(0, 0%, 100%, 0.1)
}
.discord-light-theme .discord-embed .discord-embed-description .spoiler:active {
  background-color:rgba(0, 0, 0, 0.1)
}
.discord-embed .discord-embed-fields {
  display:grid;
  grid-column:1/1;
  margin-top:8px;
  grid-gap:8px
}
.discord-embed-footer {
  -webkit-box-align:center;
  align-items:center;
  color:#dcddde;
  display:flex;
  font-size:12px;
  line-height:16px;
  font-weight:500;
  grid-column:1/3;
  grid-row:auto/auto;
  margin-top:8px
}
.discord-embed-footer .discord-footer-image {
  border-radius:50%;
  flex-shrink:0;
  height:20px;
  margin-right:8px;
  width:20px
}
.discord-embed-footer .discord-footer-separator {
  color:#dcddde;
  font-weight:500;
  display:inline-block;
  margin:0 4px
}
.discord-light-theme .discord-embed-footer .discord-footer-separator {
  color:#e4e4e4
}
.discord-button {
  display:flex;
  justify-content:center;
  align-items:center;
  cursor:pointer;
  margin:4px 8px 4px 0;
  padding:2px 16px;
  width:auto;
  height:32px;
  min-width:60px;
  min-height:32px;
  -webkit-transition:background-color 0.17s ease, color 0.17s ease;
  transition:background-color 0.17s ease, color 0.17s ease;
  border-radius:3px;
  font-size:14px;
  font-weight:500;
  line-height:16px;
  text-decoration:none !important
}
.discord-button.discord-button-success {
  color:#fff;
  background-color:#3ba55d
}
.discord-button.discord-button-success.discord-button-hoverable:hover {
  background-color:#2d7d46
}
.discord-button.discord-button-destructive {
  color:#fff;
  background-color:#ed4245
}
.discord-button.discord-button-destructive.discord-button-hoverable:hover {
  background-color:#c03537
}
.discord-button.discord-button-primary {
  color:#fff;
  background-color:#5865f2
}
.discord-button.discord-button-primary.discord-button-hoverable:hover {
  background-color:#4752c4
}
.discord-button.discord-button-secondary {
  color:#fff;
  background-color:#4f545c
}
.discord-button.discord-button-secondary.discord-button-hoverable:hover {
  background-color:#5d6269
}
.discord-button.discord-button-disabled {
  cursor:not-allowed;
  opacity:0.5
}
.discord-button .discord-button-launch {
  margin-left:8px
}
.discord-button .discord-button-emoji {
  margin-right:4px;
  object-fit:contain;
  width:1.375em;
  height:1.375em;
  vertical-align:bottom
}
.discord-embed .discord-embed-field {
  font-size:0.875rem;
  line-height:1.125rem;
  min-width:0;
  font-weight:400;
  grid-column:1/13
}
.discord-embed .discord-embed-field .discord-field-title {
  color:#ffffff;
  font-weight:600;
  font-size:0.875rem;
  line-height:1.125rem;
  min-width:0;
  margin-bottom:2px
}
.discord-embed .discord-embed-field.discord-inline-field {
  flex-grow:1;
  flex-basis:auto;
  min-width:150px
}
.discord-light-theme .discord-embed .discord-embed-field .discord-field-title {
  color:#747f8d
}
.discord-embed-inline-field-3 {
  grid-column:9/13 !important
}
.discord-embed-inline-field-2 {
  grid-column:5/9 !important
}
.discord-embed-inline-field-1 {
  grid-column:1/5 !important
}
.discord-time {
  background-color:#ffffff0f;
  border-radius:3px;
  padding:0 2px
}
discord-action-row,
discord-attachment,
discord-attachments,
discord-bold,
discord-button,
discord-code-block,
discord-command,
discord-custom-emoji,
discord-embed,
discord-embed-description,
discord-embed-field,
discord-embed-fields,
discord-embed-footer,
discord-header,
discord-inline-code,
discord-invite,
discord-italic,
discord-mention,
discord-message,
discord-messages,
discord-quote,
discord-reaction,
discord-reactions,
discord-reply,
discord-spoiler,
discord-system-message,
discord-tenor-video,
discord-thread,
discord-thread-message,
discord-time,
discord-underlined {
  visibility:hidden
}
.hydrated {
  visibility:inherit;
}
.scroller {
  overflow-y: scroll;
  scrollbar-color: black white;
}

.scroller::-webkit-scrollbar {
    width: 15px;
    height: 15px;
}

.scroller::-webkit-scrollbar-track-piece  {
    background-color: #C2D2E4;
}

.scroller::-webkit-scrollbar-thumb:vertical {
    height: 30px;
    background-color: #0A4C95;
}
/* greek */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-400-normal.woff) format('woff'); 
  unicode-range: U+0370-03FF;
}

/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-400-normal.woff) format('woff'); 
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

/* cyrillic */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-400-normal.woff) format('woff'); 
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* greek-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-400-normal.woff) format('woff'); 
  unicode-range: U+1F00-1FFF;
}

/* latin-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-400-normal.woff) format('woff'); 
  unicode-range: U+0100-02AF,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* vietnamese */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-400-normal.woff) format('woff'); 
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* cyrillic-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-400-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-400-normal.woff) format('woff'); 
  unicode-range: U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* greek */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-500-normal.woff) format('woff'); 
  unicode-range: U+0370-03FF;
}

/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-500-normal.woff) format('woff'); 
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

/* cyrillic */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-500-normal.woff) format('woff'); 
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* greek-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-500-normal.woff) format('woff'); 
  unicode-range: U+1F00-1FFF;
}

/* latin-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-500-normal.woff) format('woff'); 
  unicode-range: U+0100-02AF,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* vietnamese */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-500-normal.woff) format('woff'); 
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* cyrillic-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-500-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-500-normal.woff) format('woff'); 
  unicode-range: U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* greek */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-700-normal.woff) format('woff'); 
  unicode-range: U+0370-03FF;
}

/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-700-normal.woff) format('woff'); 
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

/* cyrillic */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-700-normal.woff) format('woff'); 
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* greek-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-greek-ext-700-normal.woff) format('woff'); 
  unicode-range: U+1F00-1FFF;
}

/* latin-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-latin-ext-700-normal.woff) format('woff'); 
  unicode-range: U+0100-02AF,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* vietnamese */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-vietnamese-700-normal.woff) format('woff'); 
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* cyrillic-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-700-normal.woff2) format('woff2'), url(https://fonts.bunny.net/roboto/files/roboto-cyrillic-ext-700-normal.woff) format('woff'); 
  unicode-range: U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}`
          : null}
      </style>
      {/* header */}
      <div style={{ textAlign: 'center', width: '100%', textDecoration: 'underline', color: options.headerColor }}>
        {options.headerText
          ? options.headerText.replaceAll(`{date}`, `${TSCREATEDATE}${new Date().toLocaleString()}`)
          : ``}
        {''}
      </div>
      <DiscordHeader
        guild={channel.isDMBased() ? TitleDM : channel.guild.name}
        channel={
          channel.isDMBased()
            ? channel.type === ChannelType.DM
              ? channel.recipient?.tag ?? TitleDM1
              : TitleDM1
            : channel.name
        }
        icon={channel.isDMBased() ? undefined : channel.guild.iconURL({ size: 128 }) ?? undefined}
      >
        {channel.isThread()
          ? `${TitleThread}${channel.parent?.name ?? TitleCH1}`
          : channel.isDMBased()
          ? TitleDM
          : channel.isVoiceBased()
          ? `${TitleVC}${channel.name}`
          : channel.type === ChannelType.GuildCategory
          ? TitleCT
          : TitleCT1 in channel && channel.topic
          ? await renderContent(channel.topic, { messages, channel, callbacks, type: RenderType.REPLY, ...options })
          : `${TitleCH}${channel.name}!`}
      </DiscordHeader>

      {/* body */}
      {chatBody}

      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%', textDecoration: 'underline' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replace('{s}', messages.length > 1 ? 's' : '')
          : `${Footer0} ${messages.length} ${Footer1}${messages.length > 1 ? 's' : ''}.`}{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            {Footer2}{' '}
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
        <title>{channel.isDMBased() ? TitleDM : channel.name}</title>

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
        <script
          type="module"
          src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
        ></script>
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
