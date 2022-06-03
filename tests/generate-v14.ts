// @ts-nocheck
// ^ UNCOMMENT IF v14 INSTALLED

import * as discord from 'discord.js';
import { createTranscript } from '../dist';

const client = new discord.Client({
    intents: [discord.IntentsBitField.Flags.GuildMessages, discord.IntentsBitField.Flags.Guilds]
});

client.on('ready', async () => {
    /** @type {discord.TextChannel} */
    const channel = await client.channels.fetch(process.env.CHANNEL!);

    if(!channel || !channel.isText()) {
        console.error('Invalid channel provided.');
        process.exit(1);
    }

    const attachment = await createTranscript(channel, { minify: true });

    await channel.send({
        files: [attachment]
    });

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN!);