import discord, { TextChannel } from 'discord.js';
import { createTranscript } from '../src';
import { config } from "dotenv";
config();

const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', async () => {
    const channel = await client.channels.fetch(process.env.CHANNEL) as TextChannel;

    const attachment = await createTranscript(channel);

    await channel.send({
        files: [attachment]
    });

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN);