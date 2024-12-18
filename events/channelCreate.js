const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(channel.guild.id);
        if (!logChannelId) return;

        const logChannel = channel.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Fetch audit log to determine the creator
        let creator = 'Unknown';
        try {
            const auditLogs = await channel.guild.fetchAuditLogs({
                type: 10, // Type 10 = CHANNEL_CREATE
                limit: 1,
            });
            const creationLog = auditLogs.entries.first();

            if (creationLog && creationLog.target.id === channel.id) {
                creator = `${creationLog.executor.tag} (${creationLog.executor.id})`;
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }

        // Build the embed
        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Green for creation
            .setTitle('Channel Created')
            .addFields(
                { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: true },
                { name: 'Type', value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other', inline: true },
                { name: 'Created At', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Created By', value: creator, inline: false }
            )
            .setTimestamp();

        // Send the log
        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
