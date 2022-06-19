import * as discord from 'discord.js';
import { createTranscript } from '../src';

const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', async () => {
    /** @type {discord.TextChannel} */
    const channel = await client.channels.fetch(process.env.CHANNEL!);

    if(!channel || !channel.isText() || channel.type === 'DM') {
        console.error('Invalid channel provided.');
        process.exit(1);
    }

    const attachment = await createTranscript(channel, { minify: true, useCDN: false });

    await channel.send({
        files: [attachment]
    });

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN!);