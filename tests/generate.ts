import * as discord from 'discord.js'
import { createTranscript } from '../src'

import { config } from 'dotenv'
config()

const { GuildMessages, Guilds, MessageContent } = discord.GatewayIntentBits

const client = new discord.Client({
  intents: [GuildMessages, Guilds, MessageContent],
})

client.on('ready', async () => {
  const channelId = process.env.CHANNEL
  if (!channelId) {
    console.error('CHANNEL environment variable is not set')
    process.exit(1)
  }

  console.log('Fetching channel: ', channelId)
  const channel = await client.channels.fetch(channelId)

  if (!channel || !channel.isTextBased()) {
    console.error('Invalid channel provided.')
    process.exit(1)
  }

  console.time('transcript')

  const attachment = await createTranscript(channel, {
    // options go here
  })

  console.timeEnd('transcript')

  await (channel as discord.TextChannel).send({
    content: 'Here is the transcript',
    files: [attachment],
  })

  client.destroy()
  process.exit(0)
})

const token = process.env.TOKEN
if (!token) {
  console.error('TOKEN environment variable is not set')
  process.exit(1)
}

client.login(token)
