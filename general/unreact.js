const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unreact')
        .setDescription('removes all emojis from a message.')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('the id of the message')
                .setRequired(true)
        ),

    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');

        try {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            });

            const message = await interaction.channel?.messages.fetch(messageId).catch(() => null);

            if (!message) {
                return await interaction.editReply({
                    content: '❓ cannot find that message.'
                });
            }

            await message.reactions.removeAll();

            return await interaction.editReply({
                content: '✅ all reactions removed successfully.'
            });

        } catch (error) {
            console.error(error);

            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({
                    content: `❌ error: ${error.message}`
                });
            }

            return interaction.reply({
                content: `❌ error: ${error.message}`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
