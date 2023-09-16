import type { AttachmentBuilder } from 'discord.js';
import type { RenderMessageContext } from './generator';
import type { Languages } from './languages';

export type AttachmentTypes = 'audio' | 'video' | 'image' | 'file';

export enum ExportReturnType {
  Buffer = 'buffer',
  String = 'string',
  Attachment = 'attachment',
}

export type ObjectType<T extends ExportReturnType> = T extends ExportReturnType.Buffer
  ? Buffer
  : T extends ExportReturnType.String
  ? string
  : AttachmentBuilder;

export type GenerateFromMessagesOptions<T extends ExportReturnType> = Partial<{
  /**
   * The type of object to return
   * @default ExportReturnType.ATTACHMENT
   */
  returnType: T;

  /**
   * Downloads images and encodes them as base64 data urls
   * @default false
   */
  saveImages: boolean;

  /**
   * Callbacks for resolving channels, users, and roles
   */
  callbacks: RenderMessageContext['callbacks'];

  /**
   * The name of the file to return if returnType is ExportReturnType.ATTACHMENT
   * @default 'transcript-{channel-id}.html'
   */
  filename: string;

  /**
   * Whether to include the "Powered by discord-html-transcripts" footer
   * @default true
   */
  poweredBy: boolean;

  /**
   * The message right before "Powered by" text. Remember to put the {s}
   * @default 'Exported {number} message{s}.'
   */
  footerText: string;

  /**
   * Whether to show the guild icon or a custom icon as the favicon
   * 'guild' - use the guild icon
   * or pass in a url to use a custom icon
   * @default "guild"
   */
  favicon: 'guild' | string;

  /**
   * Whether to hydrate the html server-side
   * @default false - the returned html will be hydrated client-side
   */
  hydrate: boolean;

  /**
   * The language to use, e.g. 'en-US'. See documentation for list of supported languages.
   * @default 'en-US'
   */
  language: Languages;
}>;

export type CreateTranscriptOptions<T extends ExportReturnType> = Partial<
  GenerateFromMessagesOptions<T> & {
    /**
     * The max amount of messages to fetch. Use `-1` to recursively fetch.
     */
    limit: number;
  }
>;
