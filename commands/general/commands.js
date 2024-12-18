// commands.js
const { EmbedBuilder } = require('discord.js');
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'commands',
    description: 'Lists all available commands.',
    category: 'General',
    async execute(message, args, client) {
        const prefix = configHandler.getPrefix(message.guild.id);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📚 Bot Commands')
            .setDescription('Here is a list of all available commands:')
            .setTimestamp()
            .setFooter({ text: 'Bot by YourName' });

        // Dynamically categorize commands
        const categories = {};

        client.commands.forEach(command => {
            const category = command.category || 'Uncategorized';
            if (!categories[category]) categories[category] = [];
            categories[category].push(`\`${prefix}${command.name}\`: ${command.description}`);
        });

        // Add commands to embed categorized by their categories
        for (const [category, cmds] of Object.entries(categories)) {
            embed.addFields({ name: `**${category}**`, value: cmds.join('\n'), inline: false });
        }

        // **Add Presets Information**
        const logChannelId = configHandler.getLogChannel(message.guild.id);
        const logChannel = logChannelId ? `<#${logChannelId}>` : 'Not Set';
        const adminRoleName = configHandler.getAdminRole() || 'Not Set';
        const verificationRoleName = configHandler.getVerificationRole() || 'Not Set';
        const archiveCategoryId = configHandler.getArchiveCategory() ? `<#${configHandler.getArchiveCategory()}>` : 'Not Set';
        const collabCategoryId = configHandler.getCollabCategory() ? `<#${configHandler.getCollabCategory()}>` : 'Not Set';

        // **Add Counting Game Information**
        const countingChannels = configHandler.getCountingChannels(message.guild.id);
        const countingChannelsFormatted = countingChannels.length > 0
            ? countingChannels.map(id => `<#${id}>`).join(', ')
            : 'No counting channels set.';

        embed.addFields(
            {
                name: '📁 Current Presets',
                value: `**Log Channel:** ${logChannel}\n**Admin Role:** ${adminRoleName}\n**Verification Role:** ${verificationRoleName}\n**Archive Category:** ${archiveCategoryId}\n**Collaboration Category:** ${collabCategoryId}`,
                inline: false
            },
            {
                name: '🎲 Counting Game',
                value: `**Counting Channels:** ${countingChannelsFormatted}\n**Setup Command:** \`${prefix}setcountingchannel add #channel\`\n**Manage Counting Channels:** \`${prefix}setcountingchannel add/remove/list\`\n**Set Counting Mode:** \`${prefix}setcountingmode #channel <mode>\`\n**Available Modes:** normal, hex, binary, count2, count3, count4, count5, countdown`,
                inline: false
            },
            {
                name: '📚 Clubs',
                value: Object.keys(configHandler.getAllClubs()).length > 0
                    ? Object.entries(configHandler.getAllClubs()).map(([club, details]) =>
                        `**${club}** - Max Officers: ${details.maxOfficers}, Officer Roles: ${details.officerRoles.join(', ')}, Additional Roles: ${details.additionalRoles.join(', ')}`
                    ).join('\n')
                    : 'No clubs configured.',
                inline: false
            }
        );

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};
