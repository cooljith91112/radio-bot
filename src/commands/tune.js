const { VoiceChannel, TextChannel, MessageEmbed } = require('discord.js');
const fs = require('fs');
const readFile = fs.promises.readFile;
let radioIndex = 0;

async function broadcastRadio(client, args, message, voiceChannel, textChannel) {
    const connection = await voiceChannel.join();
    try {
        playRadio(connection, textChannel, args);
    } catch (error) {
        console.log(error);
        textChannel.send('Something went wrong. RADIO MON got ill...😱😱');
    }
}

async function playRadio(connection, textChannel, args) {
    try {
        const [radioCommand] = args;
        const radioConfig = await readFile('src/configs/radio.json', 'utf8');
        const radioStations = JSON.parse(radioConfig);
        const totalRadioStations = radioStations.length;
        let currentRadioStation;
        if (!radioCommand) {
            radioIndex = 0;
            currentRadioStation = radioStations[radioIndex];
        } else {
            switch (radioCommand) {
                case 'next':
                    radioIndex++;
                    if (radioIndex >= totalRadioStations) radioIndex = 0;
                    break;
                case 'prev':
                    radioIndex--;
                    if (radioIndex < 0) radioIndex = totalRadioStations - 1;
                    currentRadioStation = radioStations[radioIndex];
                    break;
            }
        }
        currentRadioStation = radioStations[radioIndex];
        connection.play(`${currentRadioStation.url}`, { seek: 0, volume: 1 });
        const nowPlayingMessage = new MessageEmbed()
            .setTitle("Now Playing")
            .setDescription(currentRadioStation.name)
            .setColor('LUMINOUS_VIVID_PINK');
        textChannel.send(nowPlayingMessage)
    } catch (error) {
        console.log(error);
    };
};

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