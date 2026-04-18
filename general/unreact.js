const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unreact')
        .setDescription('Removes all reactions from multiple messages.')
        .addStringOption(option =>
            option.setName('message_ids')
                .setDescription('Message IDs separated by spaces or commas')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        if (!interaction.inGuild() || !interaction.channel?.isTextBased()) {
            return interaction.editReply({
                content: '❌ Must be used in a server text channel.'
            });
        }

        const input = interaction.options.getString('message_ids');

        const messageIds = input
            .split(/[\s,]+/)
            .map(id => id.trim())
            .filter(Boolean);

        const channel = interaction.channel;

        let success = 0;
        let failed = 0;

        for (const messageId of messageIds) {
            try {
                const message = await channel.messages.fetch(messageId);

                await message.fetch();
                await message.reactions.removeAll();

                success++;
            } catch (err) {
                console.error(`Failed on ${messageId}:`, err.message);
                failed++;
            }
        }

        return interaction.editReply({
            content: `✅ Done\n✔ Cleared: ${success}\n❌ Failed: ${failed}`
        });
    }
};
