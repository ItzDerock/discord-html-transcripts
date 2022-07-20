import type {
    Collection,
    Message,
    DMChannel,
    PartialDMChannel,
    TextBasedChannel,
} from 'discord.js';

import type { AttachmentBuilder } from 'discord.js-14';

export type ReturnTypes = 'buffer' | 'string' | 'attachment';

export type ObjectType<T> = 
    T extends 'buffer' ? Buffer
    : T extends 'string' ? string
    : T extends 'attachment' ? AttachmentBuilder
    : AttachmentBuilder;

export type GenerateFromMessagesOpts = {
    returnType?: ReturnTypes;
    fileName?: string;
    minify?: boolean;
    saveImages?: boolean;
    useCDN?: boolean;
};

export type GenerateSource = Collection<string, Message> | Message[];

export type CreateTranscriptOptions = GenerateFromMessagesOpts & {
    limit?: number;
};

export type internalGenerateOptions = {
    returnBuffer?: boolean;
    returnType?: ReturnTypes;
    fileName?: string;
    minify?: boolean;
    saveImages?: boolean;
    useCDN?: boolean;
};

export type ValidTextChannels = Exclude<
    TextBasedChannel,
    DMChannel | PartialDMChannel
>;

/* some util types */
export type Class<T> = new (...args: any[]) => T;

// https://discord.com/channels/244230771232079873/544853878651355148/999323779379499119
export type ReturnTypeWrapper<T> = 
    T extends GenerateFromMessagesOpts ? 
        T["returnType"] extends undefined 
            ? AttachmentBuilder
            : ObjectType<T["returnType"]>
        : AttachmentBuilder