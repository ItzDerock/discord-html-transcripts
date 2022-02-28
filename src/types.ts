import { 
    Collection, 
    Message, 
    DMChannel,
    PartialDMChannel,
    NewsChannel,
    TextChannel,
    ThreadChannel
} from 'discord.js';

export type GenerateFromMessagesOpts = {
    returnBuffer?: boolean,
    fileName?: string
}

export type GenerateSource = Collection<string, Message> | Message[];

export type CreateTranscriptOptions = GenerateFromMessagesOpts & {
    limit?: number
}

export type internalGenerateOptions = {
    returnBuffer: boolean,
    fileName: string
}

export type ValidTextChannels = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel