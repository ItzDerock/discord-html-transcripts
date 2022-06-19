import { Collection, Message } from 'discord.js';
import type { TextBasedChannel } from 'discord.js-14';
import exportHtml from './exporthtml';

import {
    GenerateSource,
    GenerateFromMessagesOpts,
    CreateTranscriptOptions, 
    ValidTextChannels
} from './types';
import { castToType } from './utils';

/** 
 * @example
 * const discordTranscripts = require('discord-html-transcripts');
 * // or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';
 * 
 * const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
 * const channel  = someWayToGetChannel();  // Used for ticket name, guild icon, and guild name
 * 
 * // You do not need to await this
 * const attachment = discordTranscripts.generateFromMessages(messages, channel);
 * 
 * channel.send({
 *     files: [attachment]
 * });
 */
export const generateFromMessages = (messages: GenerateSource, channel: ValidTextChannels, opts?: GenerateFromMessagesOpts) => {
    var options = opts || {};

    if(('returnBuffer' in options)) options.returnType = options.returnType ?? (options.returnBuffer ? 'buffer' : 'attachment')
    if(!('fileName'    in options)) options.fileName   = `transcript-${channel.id}.html`;
    if(!('returnType'  in options)) options.returnType = 'attachment';

    // Turn collection into an array
    if(messages instanceof Collection) {
        messages = Array.from(messages.values());
    }

    // Check if is array
    if(!Array.isArray(messages)) {
        throw new Error('Provided messages must be either an array or a collection of Messages.');
    }

    // If no messages were provided, generate empty transcript
    if(messages.length === 0) {
        return exportHtml(messages, channel, options);
    }

    // Check if array contains discord messages
    if(!(messages[0] instanceof Message)) {
        throw new Error('Provided messages does not contain valid Messages.');
    }

    return exportHtml(messages, channel, options);
}

/**
 * @example
 * const discordTranscripts = require('discord-html-transcripts');
 * // or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';
 * 
 * const channel = message.channel; // or however you get your TextChannel
 * 
 * // Must be awaited
 * const attachment = await discordTranscripts.createTranscript(channel);
 * 
 * channel.send({
 *     files: [attachment]
 * });
 */
export const createTranscript = async (channel: ValidTextChannels, opts?: CreateTranscriptOptions) => {
    var options = opts || {};

    if(('returnBuffer' in options))  options.returnType = options.returnType ?? (options.returnBuffer ? 'buffer' : 'attachment')
    if(!('fileName'    in options))  options.fileName   = `transcript-${channel.id}.html`;
    if(!('returnType'  in options))  options.returnType = 'attachment';
    if(!('limit'       in options))  options.limit      = -1;

    if(!channel)
        throw new TypeError('Provided channel must be a valid channel.');

    if(
        // general checks
        !channel
        ||

        // v13
        (
            (typeof channel.isText === 'function')
            && (!channel.isText())
        )
        
        || 
        // v14 (dev)
        (
            (typeof castToType<TextBasedChannel>(channel).isTextBased === "function") 
            && (!castToType<TextBasedChannel>(channel).isTextBased())
        )
    ) throw new TypeError('Provided channel must be a valid channel.');

    const sum_messages: Message[] = [];
    var last_id: string | undefined;

    while (true) {
        const options  = { limit: 100, before: last_id };
        if(!last_id) delete options['before'];
        
        const messages = await channel.messages.fetch(options);
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last()?.id;
    
        if (messages.size != 100 || ((options.limit! > 0) && sum_messages.length >= options.limit!)) break;
    }

    return await exportHtml(sum_messages, channel, options);
}