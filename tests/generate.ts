import * as discord from 'discord.js';
import { createTranscript } from '../src';

import { config } from 'dotenv';
config();

const { GuildMessages, Guilds, MessageContent } = discord.GatewayIntentBits;

const client = new discord.Client({
  intents: [GuildMessages, Guilds, MessageContent],
});

client.on('ready', async () => {
  console.log('Fetching channel: ', process.env.CHANNEL!);
  const channel = await client.channels.fetch(process.env.CHANNEL!);

  if (!channel || !channel.isTextBased()) {
    console.error('Invalid channel provided.');
    process.exit(1);
  }

  console.time('transcript');

  const attachment = await createTranscript(channel, {
    // options go here
  });

  console.timeEnd('transcript');

  await channel.send({
    files: [attachment],
  });

  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
