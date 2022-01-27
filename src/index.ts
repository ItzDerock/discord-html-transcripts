import exportHtml from './exporthtml';
import { Message, Collection, MessageAttachment, TextChannel } from 'discord.js';
import { Options } from 'types';

/**
 * 
 * @param {Collection<string, Message> | Message[]} messages 
 * @param {Channel} channel
 * @param {Object} opts
 * @param {Boolean} opts.returnBuffer Whether to return a buffer of the html or a message attachment.
 * @param {String} opts.fileName The name of the file. [ONLY VALID WITH `returnBuffer` SET TO FALSE]
 * @returns {MessageAttachment | Buffer} 
 */
const generateFromMessages = (messages: Collection<string, Message> | Message[], channel: TextChannel, opts: Options = { returnBuffer: false }): MessageAttachment | Buffer => {
    if (!opts.fileName) opts.fileName = 'transcript.html';

    // check if is array
    if (!Array.isArray(messages)) {
        throw new Error('Provided messages must be either an array or a collection of Messages.');
    }

    // check if array contains discord messages
    if (!(messages[0] instanceof Message)) {
        throw new Error('Provided messages does not contain valid Messages.');
    }

    return exportHtml(messages, channel, opts);
};

/**
 * 
 * @param {discord.Channel} channel 
 * @param {Object} opts
 * @param {Number} opts.limit Max amount of messages to fetch. Set to -1 to disable.
 * @param {Boolean} opts.returnBuffer Whether to return a buffer of the html or a message attachment.
 * @param {String} opts.fileName The name of the file. [ONLY VALID WITH `returnBuffer` SET TO FALSE]
 */
const createTranscript = async (channel: TextChannel, opts: Options = { limit: -1 }) => {
    if (!opts.returnBuffer) opts.returnBuffer = false;
    if (!opts.fileName) opts.fileName = 'transcript.html';
    if (!opts.limit) opts.limit = -1;

    if (!(channel.isText)) {
        throw new Error('Provided channel must be a valid channel.');
    }

    if (!channel.isText()) {
        throw new Error('Provided channel must be a text channel.');
    }

    const sum_messages = [];
    var last_id;

    while (true) {
        const messages = await channel.messages.fetch({ limit: 100, before: last_id });
        sum_messages.push(...messages.values());
        last_id = messages.last().id;

        if (messages.size != 100 || (opts.limit > 0 && sum_messages.length >= opts.limit)) {
            break;
        }
    }

    return exportHtml(sum_messages, channel, opts);
};

export { generateFromMessages, createTranscript };