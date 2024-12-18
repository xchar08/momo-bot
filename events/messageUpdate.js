// messageUpdate.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (oldMessage.partial || newMessage.partial) return;
        if (oldMessage.content === newMessage.content) return;

        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(newMessage.guild.id);
        if (!logChannelId) return;

        const logChannel = newMessage.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle('Message Edited')
            .addFields(
                { name: 'Author', value: newMessage.author.tag, inline: true },
                { name: 'Channel', value: newMessage.channel.toString(), inline: true },
                { name: 'Before', value: oldMessage.content || 'No content', inline: false },
                { name: 'After', value: newMessage.content || 'No content', inline: false }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
