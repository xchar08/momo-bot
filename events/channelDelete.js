// events/channelDelete.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(channel.guild.id);
        if (!logChannelId) return;

        const logChannel = channel.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Channel Deleted')
            .addFields(
                { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: true },
                { name: 'Type', value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other', inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
