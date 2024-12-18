const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'commands',
    description: 'Lists all available commands.',
    category: 'General',
    async execute(message, args, client) {
        const configHandler = client.configHandler;
        const prefix = configHandler.getPrefix(message.guild.id) || '!';

        // Get configurations
        const logChannel = configHandler.getLogChannel(message.guild.id) || 'Not Set';
        const adminRole = configHandler.getAdminRole() || 'Not Set';
        const verificationRole = configHandler.getVerificationRole() || 'Not Set';
        const archiveCategory = configHandler.getArchiveCategory() || 'Not Set';
        const collabCategory = configHandler.getCollabCategory() || 'Not Set';
        const countingChannels = configHandler.getCountingChannels(message.guild.id);
        const clubs = configHandler.getAllClubs();

        const countingModes = 'normal, hex, binary, count2, count3, count4, count5, countdown';

        // Build embed
        const embed = new EmbedBuilder()
            .setColor('#0078FF')
            .setTitle('📘 Bot Commands')
            .setDescription('Here is a list of all available commands:')
            .addFields(
                {
                    name: '**Admin**',
                    value: `\`${prefix}addclub\`: Adds a new club to the configuration.\n` +
                        `\`${prefix}forceverify\`: Forcefully verifies a member, allowing clubs to exceed their member limit temporarily.\n` +
                        `\`${prefix}setadminrole\`: Sets the admin role.\n` +
                        `\`${prefix}setarchivecategory\`: Sets the archive category for the server.\n` +
                        `\`${prefix}setcollabcategory\`: Sets the collaboration category for the server.\n` +
                        `\`${prefix}setcountingchannel\`: Adds, removes, or lists a counting channel.\n` +
                        `\`${prefix}setcountingmode\`: Sets the counting mode for a counting channel.\n` +
                        `\`${prefix}setlogchannel\`: Sets the log channel for the server.\n` +
                        `\`${prefix}setprefix\`: Sets a new command prefix.\n` +
                        `\`${prefix}setverifrole\`: Sets the verification role.\n` +
                        `\`${prefix}unverify\`: Unverifies a member by removing their club and verification roles.\n` +
                        `\`${prefix}verify\`: Verifies a member by assigning them a club and position.`
                },
                {
                    name: '**Collaboration**',
                    value: `\`${prefix}collab\`: Creates a temporary collaboration channel for planning events or divisions.`
                },
                {
                    name: '**General**',
                    value: `\`${prefix}commands\`: Lists all available commands.\n` +
                        `\`${prefix}ping\`: Replies with Pong!`
                },
                {
                    name: '**Override**',
                    value: `\`${prefix}override\`: Overrides officer limits by temporarily assigning roles.`
                },
                {
                    name: '**Ticket**',
                    value: `\`${prefix}ticket\`: Creates a ticket channel for admin approval of officer roles.`
                },
                {
                    name: '📁 **Current Configurations**',
                    value: `**Log Channel**: ${logChannel}\n` +
                        `**Admin Role**: ${adminRole}\n` +
                        `**Verification Role**: ${verificationRole}\n` +
                        `**Archive Category**: ${archiveCategory}\n` +
                        `**Collaboration Category**: ${collabCategory}`
                },
                {
                    name: '🎲 **Counting Game**',
                    value: `**Counting Channels**: ${countingChannels.length > 0 ? countingChannels.join(', ') : 'No counting channels set.'}\n` +
                        `**Setup Command**: \`${prefix}setcountingchannel add #channel\`\n` +
                        `**Manage Counting Channels**: \`${prefix}setcountingchannel add/remove/list\`\n` +
                        `**Set Counting Mode**: \`${prefix}setcountingmode #channel <mode>\`\n` +
                        `**Available Modes**: ${countingModes}`
                },
                {
                    name: '📂 **Clubs**',
                    value: Object.keys(clubs).length > 0
                        ? `**Configured Clubs**:\n${Object.keys(clubs).map(club => `- ${club}`).join('\n')}`
                        : 'No clubs configured.'
                }
            )
            .setFooter({ text: 'momo-bot by xchar08' })
            .setTimestamp();

        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending commands embed:', error);
            message.reply('❌ Unable to display the commands list.');
        }
    },
};
