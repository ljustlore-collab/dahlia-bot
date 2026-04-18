const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('Use the bot to react to message(s).')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_ids')
                .setDescription('Message IDs separated by spaces or commas')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        if (!interaction.inGuild() || !interaction.channel?.isTextBased()) {
            return interaction.editReply({
                content: '❌ Must be used in a server text channel.'
            });
        }

        const emoji = interaction.options.getString('emoji');

        const messageIds = interaction.options
            .getString('message_ids')
            .split(/[\s,]+/)
            .map(id => id.trim())
            .filter(Boolean);

        let successCount = 0;
        let failedCount = 0;

        for (const id of messageIds) {
            try {
                const message = await interaction.channel.messages.fetch(id);

                await message.react(emoji);
                successCount++;

            } catch (err) {
                console.error(`Failed on ${id}:`, err.message);
                failedCount++;
            }
        }

        return interaction.editReply({
            content: `✅ Reacted: ${successCount}\n❌ Failed: ${failedCount}`
        });
    }
};
