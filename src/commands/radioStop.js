const { VoiceChannel, TextChannel } = require("discord.js");

async function stopRadioBroadcast(client, args, message, voiceChannel, textChannel) {
    if (voiceChannel) {
        await voiceChannel.leave();
        textChannel.send('RADIO Stopped');
    }
}

module.exports = {
    async execute(client, message, args) {
        const { RADIO_CHANNEL, NOW_PLAYING_CHANNEL } = process.env;
        if (!RADIO_CHANNEL) return message.reply(`Please add RADIO_CHANNEL to .env with a Voice Channel ID`);
        if (!NOW_PLAYING_CHANNEL) return message.reply(`Please add NOW_PLAYING_CHANNEL to .env with a Text Channel ID`);

        const voiceChannel = await client.channels.fetch(process.env.RADIO_CHANNEL);
        const nowPlayingChannel = await client.channels.fetch(process.env.NOW_PLAYING_CHANNEL);
        if (!(voiceChannel instanceof VoiceChannel)) return message.reply(`Please provice a Voice Channel ID to the RADIO_CHANNEL`);
        if (!(nowPlayingChannel instanceof TextChannel)) return message.reply(`Please provice a Text Channel ID to the NOW_PLAYING_CHANNEL`);

        stopRadioBroadcast(client, args, message, voiceChannel, nowPlayingChannel);
    }
}