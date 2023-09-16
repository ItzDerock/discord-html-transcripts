import { AttachmentBuilder, version, Collection, type Channel, type Message, type TextBasedChannel } from 'discord.js';
import renderMessages from './generator';
import {
  ExportReturnType,
  type CreateTranscriptOptions,
  type GenerateFromMessagesOptions,
  type ObjectType,
} from './types';
import { Language } from './languages';

// version check
const versionPrefix = version.split('.')[0];

if (versionPrefix !== '14' && versionPrefix !== '15') {
  console.error(
    `[discord-html-transcripts] Versions v3.x.x of discord-html-transcripts are only compatible with discord.js v14.x.x and v15.x.x, and you are using v${version}.` +
      `    For v13.x.x support, please install discord-html-transcripts v2.x.x using "npm install discord-html-transcripts@^2".`
  );
  process.exit(1);
}

/**
 *
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<T extends ExportReturnType = ExportReturnType.Attachment>(
  messages: Message[] | Collection<string, Message>,
  channel: Channel,
  options: GenerateFromMessagesOptions<T> = {}
): Promise<ObjectType<T>> {
  // turn messages into an array
  const transformedMessages = messages instanceof Collection ? Array.from(messages.values()) : messages;

  // const startTime = process.hrtime();

  // render the messages
  const html = await renderMessages({
    messages: transformedMessages,
    channel,
    saveImages: options.saveImages ?? false,
    callbacks: {
      resolveChannel: async (id) => channel.client.channels.fetch(id).catch(() => null),
      resolveUser: async (id) => channel.client.users.fetch(id).catch(() => null),
      resolveRole: channel.isDMBased() ? () => null : async (id) => channel.guild?.roles.fetch(id).catch(() => null),

      ...(options.callbacks ?? {}),
    },
    poweredBy: options.poweredBy ?? true,
    footerText: options.footerText ?? 'Exported {number} message{s}.',
    favicon: options.favicon ?? 'guild',
    hydrate: options.hydrate ?? false,
    language: new Language(options.language ?? 'en-US'),
  });

  // get the time it took to render the messages
  // const renderTime = process.hrtime(startTime);
  // console.log(`[discord-html-transcripts] Rendered ${transformedMessages.length} messages in ${renderTime[0]}s ${renderTime[1] / 1000000}ms`);

  // return the html in the specified format
  if (options.returnType === ExportReturnType.Buffer) {
    return Buffer.from(html) as unknown as ObjectType<T>;
  }

  if (options.returnType === ExportReturnType.String) {
    return html as unknown as ObjectType<T>;
  }

  return new AttachmentBuilder(Buffer.from(html), {
    name: options.filename ?? `transcript-${channel.id}.html`,
  }) as unknown as ObjectType<T>;
}

/**
 *
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<T extends ExportReturnType = ExportReturnType.Attachment>(
  channel: TextBasedChannel,
  options: CreateTranscriptOptions<T> = {}
): Promise<ObjectType<T>> {
  // validate type
  if (!channel.isTextBased()) {
    // @ts-expect-error(2339): run-time check
    throw new TypeError(`Provided channel must be text-based, received ${channel.type}`);
  }

  // fetch messages
  let allMessages: Message[] = [];
  let lastMessageId: string | undefined;
  const { limit } = options;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

  // until there are no more messages, keep fetching
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // create fetch options
    const fetchLimitOptions = { limit: 100, before: lastMessageId };
    if (!lastMessageId) delete fetchLimitOptions.before;

    // fetch messages
    const messages = await channel.messages.fetch(fetchLimitOptions);

    // add the messages to the array
    allMessages.push(...messages.values());
    lastMessageId = messages.lastKey();

    // if there are no more messages, break
    if (messages.size < 100) break;

    // if the limit has been reached, break
    if (allMessages.length >= resolvedLimit) break;
  }

  if (resolvedLimit < allMessages.length) allMessages = allMessages.slice(0, limit);

  // generate the transcript
  return generateFromMessages<T>(allMessages.reverse(), channel, options);
}

export default {
  createTranscript,
  generateFromMessages,
};
export * from './types';
