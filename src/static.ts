import { Options } from "html-minifier";

export const defaultPFP = 'https://cdn.discordapp.com/embed/avatars/0.png';

export const DummyUser = {
    bot: false,
    id: '00000000000',
    tag: "Unknown User#0000",
    name: "Unknown User",
    username: "Unknown User",
    hexAccentColor: "#FFFFFF",
    avatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png'
}

export const LanguageAliases = {
    'ts': 'typescript',
    'js': 'javascript',
    'py': 'python',
    'rb': 'ruby',
}

export default {
    defaultPFP,
    DummyUser,
    LanguageAliases
}

export const MINIFY_OPTIONS: Options = {
    caseSensitive: false,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true, /* if spacing is broken this may be the issue */
    conservativeCollapse: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    preserveLineBreaks: false, /* jsdom already removes linebreaks */
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    useShortDoctype: true
}

export const timestampShort: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
}

export const timestampLong: Intl.DateTimeFormatOptions = {
    weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
}