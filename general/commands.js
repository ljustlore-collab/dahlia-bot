const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('view all available commands'),

    async execute(interaction) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const embed = new EmbedBuilder()
            .setColor('#E22D17')
            .setTitle('<:redheart:1473280267643912283> dahlia commands')
            .setDescription('<:reddot:1473280843115008093> greetings! type `/` and click my icon to see list of commands that are available. more commands are coming soon!')
            .addFields(
                {
                    name: '__general commands__',
                    value:
`<:rheartdot:1473282712629678197> /commands
<:rheartdot:1473282712629678197> /whois
<:rheartdot:1473282712629678197> /avatar`
                },
                {
                    name: '__moderation commands__',
                    value:
`<:rheartdot:1473282712629678197> /warn
<:rheartdot:1473282712629678197> /mute
<:rheartdot:1473282712629678197> /kick
<:rheartdot:1473282712629678197> /ban
<:rheartdot:1473282712629678197> /warnings
<:rheartdot:1473282712629678197> /purge
<:rheartdot:1473282712629678197> /pin
<:rheartdot:1473282712629678197> /react
<:rheartdot:1473282712629678197> /give_role`
                },
                {
                    name: '__owner utilities__',
                    value:
`<:rheartdot:1473282712629678197> /set_admin_role
<:rheartdot:1473282712629678197> /set_log_channel`
                }
            );

        await interaction.editReply({
            embeds: [embed]
        });
    }
};
