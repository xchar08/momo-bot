// roleDelete.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roleDelete',
    async execute(role, client) {
        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(role.guild.id);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Role Deleted')
            .addFields(
                { name: 'Role', value: `${role.name} (${role.id})`, inline: true },
                { name: 'Color', value: role.hexColor, inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
