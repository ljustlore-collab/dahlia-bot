const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('use the bot to react to message(s).')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('the emoji to react with')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('comma separated message ids (example: 123,456)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const emoji = interaction.options.getString('emoji');
        const messageIds = interaction.options
            .getString('message_id')
            .split(',')
            .map(id => id.trim());

        let successCount = 0;
        let failedCount = 0;

        try {
            for (const id of messageIds) {
                const message = await interaction.channel?.messages.fetch(id).catch(() => null);

                if (!message) {
                    failedCount++;
                    continue;
                }

                try {
                    await message.react(emoji);
                    successCount++;
                } catch {
                    failedCount++;
                }
            }

            return interaction.editReply({
                content: `✅ reacted: ${successCount}\n❌ failed: ${failedCount}`
            });

        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `❌ error: ${error.message}`
            });
        }
    }
};
