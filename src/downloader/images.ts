import type { APIAttachment, APIMessage, Awaitable } from 'discord.js';
import type { WebpOptions } from 'sharp';
import { request } from 'undici';
import debug from 'debug';

/**
 * Callback used to save an image attachment.
 * The returned string is the URL that will be used in the transcript.
 *
 * `undefined` indicates to use the original attachment URL.
 * `null` indicates to not include the attachment in the transcript.
 * `string` indicates to use the returned URL as the attachment URL (base64 or remote image).
 */
export type ResolveImageCallback = (
  attachment: APIAttachment,
  message: APIMessage
) => Awaitable<string | null | undefined>;

/**
 * Builder to build a image saving callback.
 */
export class TranscriptImageDownloader {
  private static log = debug('discord-html-transcripts:TranscriptImageDownloader');
  private log = TranscriptImageDownloader.log;

  private maxFileSize?: number; // in kilobytes
  private compression?: {
    quality: number; // 1-100
    convertToWebP: boolean;
    options: Omit<WebpOptions, 'quality' | 'force'>;
  };

  /**
   * Sets the maximum file size for *each* individual image.
   * @param size The maximum file size in kilobytes
   */
  withMaxSize(size: number) {
    this.maxFileSize = size;
    return this;
  }

  /**
   * Sets the compression quality for each image. This requires `sharp` to be installed.
   * Optionally, images can be converted to WebP format which is smaller in size.
   * @param quality The quality of the image (1 lowest - 100 highest). Lower quality means smaller file size.
   * @param convertToWebP Whether to convert the image to WebP format
   */
  withCompression(quality = 80, convertToWebP = false, options: Omit<WebpOptions, 'quality' | 'force'> = {}) {
    if (quality < 1 || quality > 100) throw new Error('Quality must be between 1 and 100');

    // try and import sharp
    import('sharp').catch((err) => {
      console.error(err);
      console.error(
        `[discord-html-transcripts] Failed to import 'sharp'. Image compression requires the 'sharp' package to be installed. Either install sharp or remove the compression options.`
      );
    });

    this.compression = { quality, convertToWebP, options };
    return this;
  }

  /**
   * Builds the image saving callback.
   */
  build(): ResolveImageCallback {
    return async (attachment) => {
      // if the attachment is not an image, return null
      if (!attachment.width || !attachment.height) return undefined;

      // if the max file size is set, check if the file size is within the limit
      if (this.maxFileSize && attachment.size > this.maxFileSize * 1024) return undefined;

      // fetch the image
      this.log(`Fetching attachment ${attachment.id}: ${attachment.url}`);
      const response = await request(attachment.url).catch((err) => {
        console.error(`[discord-html-transcripts] Failed to download image for transcript: `, err);
        return null;
      });

      if (!response) return undefined;

      const mimetype = response.headers['content-type'];
      const buffer = await response.body.arrayBuffer().then((res) => Buffer.from(res));
      this.log(`Finished fetching ${attachment.id} (${buffer.length} bytes)`);

      // if the compression options are set, compress the image
      if (this.compression) {
        const sharp = await import('sharp');

        this.log(`Compressing ${attachment.id} with 'sharp'`);
        const sharpbuf = await sharp
          .default(buffer)
          .webp({
            quality: this.compression.quality,
            force: this.compression.convertToWebP,
            effort: 2,
            ...this.compression.options,
          })
          .toBuffer({ resolveWithObject: true });
        this.log(`Finished compressing ${attachment.id} (${sharpbuf.info.size} bytes)`);

        return `data:image/${sharpbuf.info.format};base64,${sharpbuf.data.toString('base64')}`;
      }

      // return the base64 string
      return `data:${mimetype};base64,${buffer.toString('base64')}`;
    };
  }
}
