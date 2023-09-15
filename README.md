# `discord-html-transcripts`

[![Discord](https://img.shields.io/discord/555474311637499955?label=discord)](https://discord.gg/rf5qN7C)
[![npm](https://img.shields.io/npm/dw/discord-html-transcripts)](http://npmjs.org/package/discord-html-transcripts)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ItzDerock/discord-html-transcripts)
![GitHub Repo stars](https://img.shields.io/github/stars/ItzDerock/discord-html-transcripts?style=social)

Discord HTML Transcripts is a node.js module to generate nice looking HTML transcripts. Processes discord markdown like **bold**, _italics_, ~~strikethroughs~~, and more. Nicely formats attachments and embeds. Built in XSS protection, preventing users from inserting arbitrary html tags.

This module can format the following:
- Languages (English & Brazilian [Languange information is below])
- Discord flavored markdown
  - Uses [discord-markdown-parser](https://github.com/ItzDerock/discord-markdown-parser)
  - Allows for complex markdown syntax to be parsed properly
- Embeds
- System messages
  - Join messages
  - Message Pins
  - Boost messages
- Slash commands
  - Will show the name of the command in the same style as Discord
- Buttons
- Reactions
- Attachments
  - Images, videos, audio, and generic files
- Replies
- Mentions
- Threads

**This module is designed to work with the latest version of [discord.js](https://discord.js.org/#/) _only_. If you need v13 support, roll back to v2.X.X**

Styles from [@derockdev/discord-components](https://github.com/ItzDerock/discord-components).  
Behind the scenes, this package uses React SSR to generate a static site.

## 👋 Support

Please do not DM me requesting support with this package, I will not respond.  
Instead, please open a thread on [this](https://discord.gg/MZQN8QMJg8) server.

**This module uses a completely new CSS system and adds new features, there are ways to change back the CSS to the original version**

Styles from [@derockdev/discord-components](https://github.com/ItzDerock/discord-components).  
Behind the scenes, this package uses React SSR to generate a static site.

## Old CSS Example Output [Note: Does not use this module.]

![output](https://derock.media/r/6G6FIl.gif)

## Comparison of OLD Css & _New_ Css

### Old

![output](https://mdps.xyz/assets/Screenshot_2023-09-02_at_02.42.43.png)

### New

![output](https://mdps.xyz/assets/Screenshot_2023-09-02_at_02.42.09.png)

## 📝 Usage

### Example usage using the built in message fetcher.

```js
const discordTranscripts = require('discord-html-transcripts');
// or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';

const channel = message.channel; // or however you get your TextChannel

// Must be awaited
const attachment = await discordTranscripts.createTranscript(channel);

channel.send({
  files: [attachment],
});
```

### Or if you prefer, you can pass in your own messages.

```js
const discordTranscripts = require('discord-html-transcripts');
// or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';

const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
const channel = someWayToGetChannel(); // Used for ticket name, guild icon, and guild name

// Must be awaited
const attachment = await discordTranscripts.generateFromMessages(messages, channel);

channel.send({
  files: [attachment],
});
```

## ⚙️ Configuration

Both methods of generating a transcript allow for an option object as the last parameter.  
**All configuration options are optional!**

### Built in Message Fetcher

```js
const attachment = await discordTranscripts.createTranscript(channel, {
    limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
    filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE USE IF NECESSCARY !)
    footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
    callbacks: {
      // register custom callbacks for the following:
      resolveChannel: (channelId: string) => Awaitable<Channel | null>,
      resolveUser: (userId: string) => Awaitable<User | null>,
      resolveRole: (roleId: string) => Awaitable<Role | null>
    },
    customCSS: { // Custom CSS is optional and i recommand you use this feature in a future update where theres way more options to use.
      Primary: "black" // Any color for the background theme, this has to be compatiable with the CSS Language.
      TextTheme: "white" // Same as primary
    }, // More customaizable options are coming soon, this is just a minor feature for now...
    Language: "English" // Any compatiable languages. You can check below for compatiable or upcoming translations
    poweredBy: true, // Whether to include the "Powered by discord-html-transcripts" footer
    useNewCSS: true, // Whether to use the New CSS or old, although if you are going for a realistic look to discord, use old.
    headerText: "Yay! I love my messages! | {date}", // Show a string on top of the transcript. Optional
    headerColor: "green" // Your choice of color for that specific string. Remember this color is for CSS. Which means whatever color system compatible with CSS can be used. Optional | Default is green
});
```

### Providing your own messages

```js
const attachment = await discordTranscripts.generateFromMessages(messages, channel, {
  // Same as createTranscript, except no limit
});
```

### Compatiable Languages
| Language    | Information |   Translator   |
| -------- | ------- | --------   |
| English  | There by default. Developers speak and write english    |                       |
| Brazilian | Available and optional for the brazilians     | Oreczx [Github](https://github.com/OreczXOfficial)  [Website](https://oreczxdev.xyz/)      |
| French    | Coming soon eventually    |      Looking...                |
| Spanish    | Coming soon eventually    |      Looking...                |

## 🤝 Enjoy the package?

Give it a star ⭐ and/or support me on [ko-fi](https://ko-fi.com/derock)
