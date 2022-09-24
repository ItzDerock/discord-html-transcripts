import * as discord from 'discord.js';
import renderMessages from './generator';
import { CreateTranscriptOptions, ExportReturnType, GenerateFromMessagesOptions, ObjectType } from './types';

// version check
if(discord.version.split('.')[0] !== '14') {
    console.error(`[discord-html-transcripts] Versions v3.x.x of discord-html-transcripts are only compatible with discord.js v14.x.x. You are using discord.js v${discord.version}.`);
    process.exit(1);
}

/**
 * 
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<T extends ExportReturnType = ExportReturnType.ATTACHMENT>(
    messages: discord.Message[] | discord.Collection<string, discord.Message>,
    channel: discord.Channel,
    options: GenerateFromMessagesOptions<T> = {}
): Promise<ObjectType<T>> {
    // turn messages into an array
    const transformedMessages = messages instanceof discord.Collection ? Array.from(messages.values()) : messages;

    // const startTime = process.hrtime();

    // render the messages
    const html = await renderMessages({
        messages: transformedMessages,
        channel,
        saveImages: options.saveImages ?? false,
        callbacks: options.callbacks ?? {
            resolveChannel: async (id) => channel.client.channels.fetch(id),
            resolveUser: async (id) => channel.client.users.fetch(id),
            resolveRole: channel.isDMBased() 
                ? () => null 
                : async (id) => channel.guild?.roles.fetch(id),
        },
        removePoweredBy: options.poweredBy,
    });

    // get the time it took to render the messages
    // const renderTime = process.hrtime(startTime);
    // console.log(`[discord-html-transcripts] Rendered ${transformedMessages.length} messages in ${renderTime[0]}s ${renderTime[1] / 1000000}ms`);


    // return the html in the specified format
    if(options.returnType === ExportReturnType.BUFFER) {
        return Buffer.from(html) as unknown as ObjectType<T>;
    }

    if(options.returnType === ExportReturnType.STRING) {
        return html as unknown as ObjectType<T>;
    }

    return new discord.AttachmentBuilder(
        Buffer.from(html), 
        { name: options.filename ?? `transcript-${channel.id}.html` }
    ) as unknown as ObjectType<T>;
}

/**
 * 
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<T extends ExportReturnType = ExportReturnType.ATTACHMENT>(
    channel: discord.TextBasedChannel,
    options: CreateTranscriptOptions<T> = {}
): Promise<ObjectType<T>> {
    // validate type
    if(!channel.isTextBased()) {
        // @ts-ignore
        throw new TypeError(`Provided channel must be text-based, received ${channel.type}`);
    }

    // fetch messages
    const allMessages: discord.Message[] = [];
    let lastMessageId: string | undefined;

    // until there are no more messages, keep fetching
    while(true) {
        // create fetch options
        const options = { limit: 100, before: lastMessageId };
        if(!lastMessageId) delete options.before;

        // fetch messages
        const messages = await channel.messages.fetch(options);

        // add the messages to the array
        allMessages.push(...messages.values());
        lastMessageId = messages.last()?.id;

        // if there are no more messages, break
        if(messages.size < 100) break;

        // if the limit has been reached, break
        if(allMessages.length >= (options.limit ?? Infinity)) break;
    }

    // generate the transcript
    return generateFromMessages<T>(allMessages.reverse(), channel, options);
}

export default {
    createTranscript,
    generateFromMessages,
}