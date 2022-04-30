import { 
    Collection, 
    Message, 
    DMChannel,
    PartialDMChannel,
    TextBasedChannel,
    MessageAttachment
} from 'discord.js';

export type ReturnTypes = 'buffer' | 'string' | 'attachment';

export type ObjectType<T> = 
    T extends "buffer"     ? Buffer :
    T extends "string"     ? string :
    T extends "attachment" ? MessageAttachment :
    MessageAttachment;

export type GenerateFromMessagesOpts = {
    /**
     * @deprecated Please use returnType instead
     */
    returnBuffer?: boolean,
    returnType?: ReturnTypes
    fileName?: string
}

export type GenerateSource = Collection<string, Message> | Message[];

export type CreateTranscriptOptions = GenerateFromMessagesOpts & {
    limit?: number
}

export type internalGenerateOptions = {
    returnBuffer?: boolean,
    returnType?: ReturnTypes
    fileName?: string
}

export type ValidTextChannels = Exclude<TextBasedChannel, DMChannel | PartialDMChannel>;