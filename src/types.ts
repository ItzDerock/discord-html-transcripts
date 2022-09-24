import { Attachment } from "discord.js";
import { RenderMessageContext } from "./generator";

export enum ExportReturnType {
  BUFFER = 'buffer',
  STRING = 'string',
  ATTACHMENT = 'attachment',
};

export type ObjectType<T> = 
  T extends 'buffer' ? Buffer :
  T extends 'string' ? string :
  Attachment;

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
  callbacks: RenderMessageContext['callbacks'],

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
}>;

export type CreateTranscriptOptions<T extends ExportReturnType> = Partial<GenerateFromMessagesOptions<T> & {
  /**
   * The max amount of messages to fetch
   */
  limit: number;
}>;