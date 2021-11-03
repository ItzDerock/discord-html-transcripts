declare module "discord-html-transcripts" {
  import type {
    Message,
    TextChannel,
    MessageAttachment,
    Collection,
    Guild,
  } from "discord.js";

  /**
   * Create a transcript, but with your own messages provided
   * @param messages The messages to transcript, must be a {@link Collection Collection<string, Message>} or {@link Message Message[]}
   * @param channel The channel, used for ticket name, guild icon, and guild name
   * @param options The options to use
   * @example
   * const discordTranscripts = require('discord-html-transcripts');
   *
   * const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
   * const channel  = someWayToGetChannel();  // Used for ticket name, guild icon, and guild name
   *
   * // You do not need to await this
   * const attachment = discordTranscripts.generateFromMessages(messages, channel);
   * channel.send({
   *     files: [attachment]
   * });
   */
  function generateFromMessages<B extends boolean = false>(
    messages: Collection<string, Message> | Message[],
    channel: TextChannel,
    options?: GenerateFromMessagesOptions<B>
  ): B extends true ? Buffer : MessageAttachment;
  /**
   * Create a transcript from the given channel.
   * This function return a promise, so use `await` or `then()`
   * @param channel The channel to create the transcript, must be a {@link TextChannel}
   * @param options The options of this function
   * @example
   * const discordTranscripts = require('discord-html-transcripts');
   *
   * const { channel } = message; // Or however you get to your TextChannel
   *
   * // Must be awaited
   * const attachment = await discordTranscripts.createTranscript(channel);
   *
   * channel.send({ files: [attachment] });
   */
  function createTranscript<B extends boolean = false>(
    channel: TextChannel,
    options?: CreateTranscriptOptions<B>
  ): Promise<B extends true ? Buffer : MessageAttachment>;

  interface GenerateFromMessagesOptions<B extends boolean> {
    /**
     * Whether to return a {@link Buffer} instead of a {@link MessageAttachment}
     */
    returnBuffer?: B;
    /**
     * The name of the file to send, [ONLY VALID WHEN {@link returnBuffer `returnBuffer`} IS SET TO FALSE]
     */
    fileName?: string;
  }

  interface CreateTranscriptOptions<B extends boolean>
    extends GenerateFromMessagesOptions<B> {
    /**
     * Max amount of messages to fetch. Set to -1 to disable.
     */
    limit?: number;
  }
}
