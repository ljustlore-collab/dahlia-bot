require("dotenv").config();

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'general');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    if (file === 'index.js') continue;
    const command = require(`./general/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('clientReady', () => {
    console.log(`✅ successfully turned on ${client.user.tag}`);

     client.user.setPresence({
        activities: [
            { name: '♡ moderating...', type: 4 } // 0 = Playing
                    ],
                    status: 'online'
                    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ error executing command.',
                ephemeral: true
            });
        }
});

client.login(process.env.TOKEN);