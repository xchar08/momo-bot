// events/messageDelete.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (message.author.bot) return; // Exclude bots

        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(message.guild.id);
        if (!logChannelId) return;

        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Message Deleted')
            .addFields(
                { name: 'Author', value: message.author.tag, inline: true },
                { name: 'Channel', value: message.channel.toString(), inline: true },
                { name: 'Content', value: message.content || 'No content', inline: false }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
