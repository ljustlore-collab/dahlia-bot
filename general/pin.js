const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pin')
        .setDescription('the bot will pin any messages in a channel.')
        .addStringOption(option =>
            option
                .setName('message_id')
                .setDescription('provide one or multiple message IDs (id,id)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // ✅ Correct defer (modern + ephemeral)
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const input = interaction.options.getString('message_id');
        const ids = input.split(',').map(id => id.trim());

        try {
            let successCount = 0;

            for (const id of ids) {
                try {
                    const message = await interaction.channel.messages.fetch(id);

                    if (message.pinned) {
                        throw new Error(`that message has already been pinned, ${message.url}`);
                    }

                    await message.pin();
                    successCount++;

                } catch (err) {
                    if (err.message.includes('already been pinned')) {
                        throw err;
                    }

                    throw new Error(`Failed to pin message ID ${id}`);
                }
            }

            // ✅ Use editReply AFTER defer
            await interaction.editReply({
                content: `✅ **successfully pinned ${successCount} message(s).**`
            });

        } catch (error) {
            await interaction.editReply({
                content: `❌ **${error.message}.**`
            });
        }
    }
};