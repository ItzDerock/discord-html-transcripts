import * as discord from 'discord.js-14';
import { ChannelType } from 'discord.js-14';
import { createTranscript } from '../src';
require('dotenv').config();

const client = new discord.Client({
    intents: [
        discord.IntentsBitField.Flags.GuildMessages,
        discord.IntentsBitField.Flags.Guilds,
    ],
});

client.on('ready', async () => {
    /** @type {discord.TextChannel} */
    const channel = await client.channels.fetch(process.env.CHANNEL!);

    if (
        !channel ||
        !channel.isTextBased() ||
        channel.type === ChannelType.DM ||
        channel.type === ChannelType.GuildNews
    ) {
        console.error('Invalid channel provided.');
        process.exit(1);
    }

    // @ts-ignore
    const attachment = await createTranscript(channel, { minify: true });

    await channel.send({
        files: [attachment],
    });

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN!);
