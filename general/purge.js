const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('deletes messages in this channel, including old messages.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('number of messages to delete (max 100 per batch). leave empty to delete all messages.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        // ❌ Permission check (correct way)
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ **I do not have permission to manage messages in this channel.**',
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {
            // =========================
            // PURGE LIMITED AMOUNT
            // =========================
            if (amount) {
                const messages = await channel.messages.fetch({ limit: amount });

                let deletedCount = 0;

                for (const msg of messages.values()) {
                    try {
                        await msg.delete();
                        deletedCount++;
                    } catch (err) {
                        // ignore individual failures
                    }
                }

                return interaction.editReply({
                    content: `✅ **deleted ${deletedCount} message(s).**`
                });
            }

            // =========================
            // PURGE ALL (100-BATCH LOOP)
            // =========================
            let totalDeleted = 0;

            while (true) {
                const fetched = await channel.messages.fetch({ limit: 100 });
                if (fetched.size === 0) break;

                for (const msg of fetched.values()) {
                    try {
                        await msg.delete();
                        totalDeleted++;
                    } catch (err) {
                        // ignore
                    }
                }
            }

            return interaction.editReply({
                content: `✅ **deleted ${totalDeleted} message(s).**`
            });

        } catch (error) {
            console.error(error);

            return interaction.editReply({
                content: '❌ **an error occurred while purging messages.**'
            });
        }
    },
};