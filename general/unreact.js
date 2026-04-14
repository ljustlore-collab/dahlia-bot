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
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const messageId = interaction.options.getString('message_id');

        try {
            const message = await interaction.channel.messages.fetch(messageId)
                .catch(() => null);

            if (!message) {
                return interaction.editReply({
                    content: '❓ **i cannot find that message.**'
                });
            }

            await message.reactions.removeAll();

            return interaction.editReply({
                content: '✅ **all reactions have been removed successfully.**'
            });

        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: `❌ **error: ${error.message}.**`
            });
        }
    }
};