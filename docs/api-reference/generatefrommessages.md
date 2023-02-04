# generateFromMessages

If you want to provide your own messages for finer control of what `discord-html-transcripts` will save, use this function.

## Example

{% tabs %}
{% tab title="JavaScript" %}
```javascript
const discordTranscripts = require("discord-html-transcripts");
const { Collection } = require("discord.js");

[...]

const messages = new Collection();
const channel  = /* somehow get this */;

// somehow fill the messages collection

const transcript = await discordTranscripts.generateFromMessages(
    messages, // the content in the transcript
    channel, // used for transcript title, etc
    { /* options */ }
);

// By default returns an AttachmentBuilder that can be sent in a channel.
channel.send({
    files: [attachment]
});
```
{% endtab %}

{% tab title="TypeScript" %}
```typescript
import * as discordTranscripts from "discord-html-transcripts";
import { Collection, Message } from "discord.js";

[...]

const messages = new Collection<string, Message>();
const channel  = /* somehow get this */;

// somehow fill the messages collection

const transcript = await discordTranscripts.generateFromMessages(
    messages, // the content in the transcript
    channel, // used for transcript title, etc
    { /* options */ }
);

// By default returns an AttachmentBuilder that can be sent in a channel.
channel.send({
    files: [attachment]
});
```
{% endtab %}
{% endtabs %}

## Parameters

```javascript
generateFromMessages(messages, channel, options={})
```

### `messages: Message[] | Collection<string, Message>`

These are the messages that will be used in the body of the transcript. Can either be an array of discord.js [Message](https://discord.js.org/#/docs/discord.js/main/class/Message) objects or a [Collection](https://discord.js.org/#/docs/collection/main/class/Collection) of Messages.

### `channel: TextBasedChannel`

Defined in [discord.js](https://discord.js.org/#/docs/discord.js/main/typedef/GuildTextBasedChannel) as `TextChannel | NewsChannel | ThreadChannel | VoiceChannel`\
``This is channel is used to grab information about the transcript, like guild name and icon, channel name, etc.

### `options: GenerateFromMessagesOptions`

An object with the discord-html-transcripts configuration options.

<details>

<summary>TLDR: quick summary of everything below.</summary>

```javascript
const attachment = await discordTranscripts.createTranscript(channel, {
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
    filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
    callbacks: {
      // register custom callbacks for the following:
      resolveChannel: (channelId: string) => Awaitable<Channel | null>,
      resolveUser: (userId: string) => Awaitable<User | null>,
      resolveRole: (roleId: string) => Awaitable<Role | null>
    },
    poweredBy: true // Whether to include the "Powered by discord-html-transcripts" footer
});
```

</details>

#### `options.returnType: 'buffer' | 'string' | 'attachment'`

It's recommended to use the `ExportReturnType` enum instead of passing in a string.\
This option determines what this function will return.&#x20;

* **buffer**: the HTML data as a buffer.
* string: the HTML data as a string.
* attachment: the HTML data as an `AttachmentBuilder`

The default value is `attachment`

#### `options.filename: string`

The name of the output file when the return type is `attachment`

The default value is `transcript-{channel id}.html`

#### `options.saveImages: boolean`

Enabling this option will make Discord HTML Transcripts download all image attachments. This is useful in use cases where the channel will be deleted which will wipe all images off of Discord's CDN, which will break images that aren't downloaded.

**If you are uploading the transcript to discord,** enabling this option may cause issues. Your bot may hit the upload filesize limit since images take up a lot of space!&#x20;

The default value is `false`

#### `options.footerText: string`

The text that will be used in the footer of the transcript. You can use the following placeholders:

* `{number}`: the total number of messages exported. Useful when you are using `createTranscript(...)`
* `{s}`: Adds an s if the number is >0, otherwise it is replaced with nothing

The default value is `Exported {number} message{s}`

#### `options.poweredBy: boolean`

Disabling this will remove the `Powered by discord-html-transcripts` in the footer.

The default value is `true`

#### `options.callbacks.resolveChannel: (channelId: string) => Awaitable<Channel | null>`

A custom function that will be used by the module whenever it needs to resolve a channel (for example, if someone mentions a channel)

The default option uses `channel.client.channels.fetch(...)` function.

#### `options.callbacks.resolveUser: (userId: string) => Awaitable<User | null>`

A custom function that will be used by the module whenever it needs to resolve a user (for example, if a user is mentioned)

The default option uses `channel.client.users.fetch(...)`

#### `options.callbacks.resolveRole: (roleId: string) => Awaitable<Role | null>`

#### A custom function that will be used by the module whenever it needs to resolve a role (for example, if a role is mentioned)

The default option uses `channel.guild?.roles.fetch(...)`



