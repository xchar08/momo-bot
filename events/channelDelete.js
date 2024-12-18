const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(channel.guild.id);
        if (!logChannelId) return;

        const logChannel = channel.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Fetch audit log to determine who deleted the channel
        let executor = 'Unknown';
        try {
            const auditLogs = await channel.guild.fetchAuditLogs({
                type: 12, // CHANNEL_DELETE
                limit: 1,
            });

            const deletionLog = auditLogs.entries.first();

            if (deletionLog && deletionLog.target.id === channel.id) {
                executor = `${deletionLog.executor.tag} (${deletionLog.executor.id})`;
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }

        // Build the embed
        const embed = new EmbedBuilder()
            .setColor('#FF0000') // Red for deletion
            .setTitle('Channel Deleted')
            .addFields(
                { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: true },
                { name: 'Type', value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other', inline: true },
                { name: 'Deleted By', value: executor, inline: false }
            )
            .setTimestamp();

        // Send the log
        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
