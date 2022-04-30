import { Collection, Message } from 'discord.js';
import exportHtml from './exporthtml';

import {
    GenerateSource,
    GenerateFromMessagesOpts,
    CreateTranscriptOptions, 
    ValidTextChannels
} from './types';

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

export const createTranscript = async (channel: ValidTextChannels, opts?: CreateTranscriptOptions) => {
    var options = opts || {};

    if(('returnBuffer' in options))  options.returnType = options.returnType ?? (options.returnBuffer ? 'buffer' : 'attachment')
    if(!('fileName'    in options))  options.fileName   = `transcript-${channel.id}.html`;
    if(!('returnType'  in options))  options.returnType = 'attachment';
    if(!('limit'       in options))  options.limit      = -1;

    if(!channel || !channel.isText || !(channel.isText())) {
        throw new Error('Provided channel must be a valid channel.');
    }

    const sum_messages: Message[] = [];
    var last_id: string | undefined;

    while (true) {
        const messages = await channel.messages.fetch({ limit: 100, before: last_id });
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last()?.id;
    
        if (messages.size != 100 || ((options.limit! > 0) && sum_messages.length >= options.limit!)) break;
    }

    return exportHtml(sum_messages, channel, options);
}