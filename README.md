# Discord.js HTML Transcripts
[![Discord](https://img.shields.io/discord/555474311637499955?label=discord)](https://discord.gg/rf5qN7C)
[![npm](https://img.shields.io/npm/dw/discord-html-transcripts)](http://npmjs.org/package/discord-html-transcripts)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ItzDerock/discord-html-transcripts)
![GitHub Repo stars](https://img.shields.io/github/stars/ItzDerock/discord-html-transcripts?style=social)

Discord HTML Transcripts is a node.js module to generate nice looking HTML transcripts. Processes discord markdown like **bold**, *italics*, ~~strikethroughs~~, and more. Nicely formats attachments and embeds. Built in XSS protection, preventing users from inserting html tags. 

**This module is designed to work with [discord.js](https://discord.js.org/#/) v13.**

HTML Template stolen from [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter).

## Example Output
![output](https://img.derock.dev/1wnf9q.gif)

## 📝 Usage
### Example usage using the built in message fetcher.
```js
const discordTranscripts = require('discord-html-transcripts');
// or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';

const channel = message.channel; // or however you get your TextChannel

// Must be awaited
const attachment = await discordTranscripts.createTranscript(channel);

channel.send({
    files: [attachment]
});
```

### Or if you prefer, you can pass in your own messages.
```js
const discordTranscripts = require('discord-html-transcripts');
// or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';

const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
const channel  = someWayToGetChannel();  // Used for ticket name, guild icon, and guild name

// Must be awaited
const attachment = await discordTranscripts.generateFromMessages(messages, channel);

channel.send({
    files: [attachment]
});
```

## ⚙️ Configuration
Both methods of generating a transcript allow for an option object as the last parameter.

### Built in Message Fetcher
```js
const attachment = await createTranscript(channel, {
    limit: -1, // Max amount of messages to fetch.
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
    fileName: 'transcript.html', // Only valid with returnBuffer false. Name of attachment. 
    minify: true, // Minify the result? Uses html-minifier
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    useCDN: false // Uses a CDN to serve discord styles rather than bundling it in HTML (saves ~8kb when minified)
});
```

### Providing your own messages
```js
const attachment = await generateFromMessages(messages, channel, {
    returnBuffer: false, // Return a buffer instead of a MessageAttachment 
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
    minify: true, // Minify the result? Uses html-minifier
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    useCDN: false // Uses a CDN to serve discord styles rather than bundling it in the HTML (saves ~8kb when minified)
});
```

## 🤝 Enjoy the package?
Give it a star ⭐ and/or support me on [ko-fi](https://ko-fi.com/derock)
