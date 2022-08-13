import { Collection, Message } from 'discord.js';
import type { TextBasedChannel as TBCV13 } from 'discord.js-13';
import type { TextBasedChannel as TBCV14 } from 'discord.js-14';
import exportHtml from './exporthtml';

import {
    GenerateSource,
    GenerateFromMessagesOpts,
    CreateTranscriptOptions,
    ValidTextChannels,
    ReturnTypeWrapper,
} from './types';
import { castToType, optsSetup } from './utils';

/**
 * @example
 *   const attachment = await generateFromMessages(messages, channel, {
 *       returnBuffer: false, // Return a buffer instead of a MessageAttachment 
 *       returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
 *       minify: true, // Minify the result? Uses html-minifier
 *       saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
 *       useCDN: false // Uses a CDN to serve discord styles rather than bundling it in the HTML (saves ~8kb when minified)
 *   });
 */
export function generateFromMessages<
    T extends GenerateFromMessagesOpts = {}
>(
    messages: GenerateSource,
    channel: ValidTextChannels,
    opts?: T
): Promise<ReturnTypeWrapper<T>> {
    var options: GenerateFromMessagesOpts = optsSetup(opts, channel);

    // Turn collection into an array
    if (messages instanceof Collection) {
        messages = Array.from(messages.values());
    }

    // Check if is array
    if (!Array.isArray(messages)) {
        throw new Error(
            'Provided messages must be either an array or a collection of Messages.'
        );
    }

    // If no messages were provided, generate empty transcript
    if (messages.length === 0) {
        return exportHtml(messages, channel, options) as any;
    }

    // Check if array contains discord messages
    if (!(messages[0] instanceof Message)) {
        throw new Error('Provided messages does not contain valid Messages.');
    }

    return exportHtml(messages, channel, options) as any;
};

/**
 * @example
 *   const attachment = await createTranscript(channel, {
 *       limit: -1, // Max amount of messages to fetch.
 *       returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
 *       fileName: 'transcript.html', // Only valid with returnBuffer false. Name of attachment. 
 *       minify: true, // Minify the result? Uses html-minifier
 *       saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
 *       useCDN: false // Uses a CDN to serve discord styles rather than bundling it in HTML (saves ~8kb when minified)
 *   });
 */
export async function createTranscript<
    T extends CreateTranscriptOptions = {}
>(
    channel: ValidTextChannels,
    opts?: T
): Promise<ReturnTypeWrapper<T>> {
    const options: CreateTranscriptOptions = optsSetup(opts, channel);
    if (!('limit' in options)) options.limit = -1;

    if (!channel)
        throw new TypeError('Provided channel must be a valid channel.');

    if (
        // general checks
        !channel ||
        // v13
        (typeof castToType<TBCV13>(channel).isText === 'function' &&
            !castToType<TBCV13>(channel).isText()) ||
        // v14
        (typeof castToType<TBCV14>(channel).isTextBased === 'function' &&
            !castToType<TBCV14>(channel).isTextBased())
    )
        throw new TypeError('Provided channel must be a valid channel.');

    const sum_messages: Message[] = [];
    var last_id: string | undefined;

    while (true) {
        var fetchOptions = { limit: 100, before: last_id };
        if (!last_id) delete fetchOptions['before'];

        const messages = await channel.messages.fetch(fetchOptions);
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last()?.id;

        if (messages.size != 100 || (sum_messages.length >= options.limit! && options.limit! != -1)) break;
    }

    return await exportHtml(sum_messages, channel, options) as any;
};
