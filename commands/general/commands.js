// commands.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'commands',
    description: 'Lists all available commands.',
    category: 'General',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');
        const prefix = configHandler.getPrefix(message.guild.id);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bot Commands')
            .setDescription('Here is a list of all available commands:')
            .setTimestamp()
            .setFooter('Bot by YourName');

        // Dynamically list commands
        const categories = {};

        client.commands.forEach(command => {
            const category = command.category || 'Uncategorized';
            if (!categories[category]) categories[category] = [];
            categories[category].push(`\`${prefix}${command.name}\`: ${command.description}`);
        });

        for (const [category, cmds] of Object.entries(categories)) {
            embed.addField(`**${category}**`, cmds.join('\n'), false);
        }

        // Add Presets Information
        const config = configHandler.config;
        const logChannelId = configHandler.getLogChannel(message.guild.id);
        const logChannel = logChannelId ? `<#${logChannelId}>` : 'Not Set';
        const adminRoleName = configHandler.getAdminRole() || 'Not Set';
        const verificationRoleName = configHandler.getVerificationRole() || 'Not Set';
        const archiveCategoryId = config.archiveCategoryId ? `<#${config.archiveCategoryId}>` : 'Not Set';
        const collabCategoryId = config.collabCategoryId ? `<#${config.collabCategoryId}>` : 'Not Set';

        embed.addFields(
            { name: '📁 Current Presets', value: `**Log Channel:** ${logChannel}\n**Admin Role:** ${adminRoleName}\n**Verification Role:** ${verificationRoleName}\n**Archive Category:** ${archiveCategoryId}\n**Collaboration Category:** ${collabCategoryId}`, inline: false },
            { name: '📚 Clubs', value: Object.keys(config.clubs).length > 0 ? Object.entries(config.clubs).map(([club, details]) => `**${club}** - Max Officers: ${details.maxOfficers}, Officer Roles: ${details.officerRoles.join(', ')}, Additional Roles: ${details.additionalRoles.join(', ')}`).join('\n') : 'No clubs configured.', inline: false }
        );

        message.channel.send({ embeds: [embed] });
    },
};
