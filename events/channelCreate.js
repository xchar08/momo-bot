// events/channelCreate.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(channel.guild.id);
        if (!logChannelId) return;

        const logChannel = channel.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Channel Created')
            .addFields(
                { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: true },
                { name: 'Type', value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other', inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
