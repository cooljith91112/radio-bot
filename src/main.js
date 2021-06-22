require('dotenv').config();
const fs = require('fs');
const { Client, Collection } = require('discord.js');
const { env } = require('process');

const client = new Client();
client.commands = new Collection();
const CMD_PREFIX = "!";

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(CMD_PREFIX)) {
        const commandReply = parseCMD(message);
    } 
});

client.on('ready', () => {
    console.log("RADIO BOT is now LIVE");
    initConfig();
})

function initConfig() {
    fs.readFile('src/configs/commands.config.json', 'utf8', (error, data) => {
        if (error) throw error;
        const { commands } = JSON.parse(data);
        if (commands) {
            commands.forEach(command => {
                const commandFile = require(command.file);
                client.commands.set(command.name, commandFile);
            });
        }
    })
}

function parseCMD(message) {
    const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(CMD_PREFIX.length)
        .split(/\s+/);

    if (!client.commands.has(CMD_NAME)) return false;

    if (typeof client.commands.get(CMD_NAME).execute === "function") {
        client.commands.get(CMD_NAME).execute(client, message, args);
    } else {
        console.log(`execute method is not implemented for ${CMD_NAME}.js`);
    }

    return true;
}

client.login(process.env.RADIO_BOT_TKN)
    .catch((error) => {
        console.error("BOT Login Failed ", error);
    });
