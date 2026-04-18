require("dotenv").config();

const fs = require('fs');
const path = require('path');
const express = require("express"); // ✅ added
const { Client, Collection, GatewayIntentBits, MessageFlags } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ========================
// EXPRESS SERVER (RENDER FIX)
// ========================
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ========================

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'general');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./general/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('clientReady', () => {
    console.log(`✅ successfully turned on ${client.user.tag}`);

    client.user.setPresence({
        activities: [
            { name: '♡ moderating...', type: 4 }
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

        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: '❌ error executing command.',
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: '❌ error executing command.',
                    flags: MessageFlags.Ephemeral
                });
            }
        } catch (e) {
            console.error('Failed to send error reply:', e);
        }
    }
});

client.login(process.env.TOKEN);
