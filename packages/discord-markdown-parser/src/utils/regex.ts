export const ChannelMentionRegex = /^<#(\d{17,20})>/;

export const EmojiRegex = /^<(a)?:(\w{2,32}):(\d{17,21})>/;

export const RoleMentionRegex = /^<@&(\d{17,20})>/;

export const UserMentionRegex = /^<@!?(\d{17,20})>/;

export const EveryoneRegex = /^@everyone/;

export const HereRegex = /^@here/;

export const BlockQuoteRegex = /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/;

export const CodeBlockRegex = /^```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/i;

export const EmoticonRegex = /^(¯\\_\(ツ\)_\/¯)/;

export const SpoilerRegex = /^\|\|([\s\S]+?)\|\|/;

export const StrikeThroughRegex = /^~~([\s\S]+?)~~(?!_)/;

export const TextRegex = /^[\s\S]+?(?=[^0-9A-Za-z\s]|\n\n|\n|\w+:\S|$)/;

export const TimestampRegex = /^<t:(\d+)(?::(R|t|T|d|D|f|F))?>/;
