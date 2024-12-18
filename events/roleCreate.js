// roleCreate.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roleCreate',
    async execute(role, client) {
        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(role.guild.id);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Role Created')
            .addFields(
                { name: 'Role', value: `${role.name} (${role.id})`, inline: true },
                { name: 'Color', value: role.hexColor, inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
