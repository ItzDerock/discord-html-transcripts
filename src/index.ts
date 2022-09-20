import * as discord from 'discord.js';
import renderMessages from './generator';

// version check
if(discord.version.split('.')[0] !== '14') {
    console.error(`[discord-html-transcripts] Versions v3.x.x of discord-html-transcripts are only compatible with discord.js v14.x.x. You are using discord.js v${discord.version}.`);
    process.exit(1);
}

export async function test(channel: discord.TextChannel) {
    const sum_messages: discord.Message[] = [];
    var last_id: string | undefined;

    while (true) {
        const options = { limit: 100, before: last_id };
        if (!last_id) delete options['before'];

        const messages = await channel.messages.fetch(options);
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last()?.id;

        if (
            messages.size != 100 ||
            (options.limit! > 0 && sum_messages.length >= options.limit!)
        )
            break;
    }

    return new discord.AttachmentBuilder(Buffer.from(await renderMessages({
        messages: sum_messages.sort(
            (a, b) => /* sort from oldest last, newer first */ a.createdTimestamp - b.createdTimestamp
        ),
        channel,
        callbacks: {
            resolveChannel: async (id) => channel.client.channels.fetch(id),
            resolveUser: async (id) => channel.client.users.fetch(id),
            resolveRole: async (id) => channel.guild?.roles.fetch(id),
        }
    })), {
        name: `${channel.name}.html`
    });
}