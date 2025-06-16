import type { APIMessageComponentEmoji, Emoji } from 'discord.js'
import twemoji from 'twemoji'

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function parseDiscordEmoji(emoji: Emoji | APIMessageComponentEmoji) {
  if (emoji.id) {
    return `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
  }

  if (!emoji.name) {
    throw new Error('Emoji name is undefined')
  }
  const codepoints = twemoji.convert
    .toCodePoint(emoji.name.indexOf(String.fromCharCode(0x200d)) < 0 ? emoji.name.replace(/\uFE0F/g, '') : emoji.name)
    .toLowerCase()

  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codepoints}.svg`
}
