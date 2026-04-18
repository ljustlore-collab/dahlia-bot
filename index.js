require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits, MessageFlags } = require("discord.js");

// ========================
// DISCORD CLIENT
// ========================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ========================
// EXPRESS SERVER (RENDER KEEP-ALIVE)
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
// COMMAND HANDLER
// ========================
client.commands = new Collection();

const commandsPath = path.join(__dirname, "general");

if (!fs.existsSync(commandsPath)) {
    console.error("❌ 'general' folder not found. Bot cannot load commands.");
} else {
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./general/${file}`);
        if (command?.data?.name) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`⚠️ Skipped invalid command file: ${file}`);
        }
    }
}

// ========================
// READY EVENT
// ========================
client.once("ready", () => {
    console.log(`✅ Successfully turned on ${client.user.tag}`);

    client.user.setPresence({
        activities: [
            { name: "♡ moderating...", type: 4 }
        ],
        status: "online"
    });
});

// ========================
// INTERACTIONS
// ========================
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("Command error:", error);

        try {
            const payload = {
                content: "❌ Error executing command.",
                flags: MessageFlags.Ephemeral
            };

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp(payload);
            } else {
                await interaction.reply(payload);
            }
        } catch (e) {
            console.error("Failed to send error message:", e);
        }
    }
});

// ========================
// LOGIN
// ========================
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN is missing in environment variables!");
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log("🔐 Logged into Discord"))
    .catch(err => console.error("❌ Login failed:", err));
