import type { APIMessageComponentEmoji, Emoji } from 'discord.js';
import { request } from 'undici';
import twemoji from 'twemoji';

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function parseDiscordEmoji(emoji: Emoji | APIMessageComponentEmoji) {
  if (emoji.id) {
    return `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;
  }

  const codepoints = twemoji.convert.toCodePoint(emoji.name!);
  return `https://twemoji.maxcdn.com/v/latest/svg/${codepoints}.svg`;
}

export async function downloadImageToDataURL(url: string): Promise<string | null> {
  const response = await request(url);

  const dataURL = await response.body
    .arrayBuffer()
    .then((res) => {
      const data = Buffer.from(res).toString('base64');
      const mime = response.headers['content-type'];

      return `data:${mime};base64,${data}`;
    })
    .catch((err) => {
      if (!process.env.HIDE_TRANSCRIPT_ERRORS) {
        console.error(`[discord-html-transcripts] Failed to download image for transcript: `, err);
      }

      return null;
    });

  return dataURL;
}
