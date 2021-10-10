const discord = require('discord.js');
const generateTranscript = require('discord-html-transcripts');
const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', async () => {
    /** @type {discord.TextChannel} */
    const channel = await client.channels.fetch(process.env.CHANNEL);

    const attachment = await generateTranscript.createTranscript(channel);

    await channel.send({
        files: [attachment]
    });

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN);