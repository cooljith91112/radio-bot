const { VoiceChannel, TextChannel, MessageEmbed } = require("discord.js");
const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://retrowave.ru/api/v1'
});

const resourceUrl = 'http://retrowave.ru'

async function broadcastRadio(client, args, message, voiceChannel, textChannel) {
    const connection = await voiceChannel.join();
    try {
        playRadio(connection, textChannel);
    } catch (error) {
        console.log(error);
        textChannel.send('Something went wrong. RADIO MON got ill...😱😱');
    }

}

async function playRadio(connection,textChannel) {
    const nextMusic = await getNextMusic();
    const { id, title, streamUrl, artworkUrl } = nextMusic;
    const nowPlayingMessage = new MessageEmbed()
        .setTitle("Now Playing")
        .setDescription(title)
        .setColor('LUMINOUS_VIVID_PINK')
        .setThumbnail(`${resourceUrl}${artworkUrl}`);
    textChannel.send(nowPlayingMessage)
    connection.play(`${resourceUrl}${streamUrl}`, { seek: 0, volume: 1 })
        .on('finish', () => {
            playRadio(connection,textChannel);
        });
}

async function getNextMusic() {
    const result = await instance.get('/tracks?cursor=1&limit=1');
    return result.data.body.tracks[0];
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

        broadcastRadio(client, args, message, voiceChannel, nowPlayingChannel);
    }
}