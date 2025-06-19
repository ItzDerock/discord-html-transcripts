import * as discord from 'discord.js';
import { createTranscript } from '../src';

import { config } from 'dotenv';
config();

const { TOKEN, CHANNEL } = process.env;
if (!TOKEN || !CHANNEL) {
  console.error('TOKEN and CHANNEL environment variables must be set');
  process.exit(1);
}

const { GuildMessages, Guilds, MessageContent } = discord.GatewayIntentBits;

const client = new discord.Client({
  intents: [GuildMessages, Guilds, MessageContent],
});

client.on('ready', async () => {
  console.log('Fetching channel: ', CHANNEL);
  const channel = await client.channels.fetch(CHANNEL);

  if (!channel || !channel.isTextBased()) {
    console.error('Invalid channel provided.');
    process.exit(1);
  }

  console.time('transcript');

  const attachment = await createTranscript(channel, {
    // options go here
  });

  console.timeEnd('transcript');

  await (channel as discord.TextChannel).send({
    content: 'Here is the transcript',
    files: [attachment],
  });

  client.destroy();
  process.exit(0);
});

client.login(TOKEN);
