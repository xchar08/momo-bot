const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole, client) {
        const configHandler = client.configHandler;

        // Fetch the log channel
        const logChannelId = configHandler.getLogChannel(newRole.guild.id);
        if (!logChannelId) return;

        const logChannel = newRole.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Check if the role name changed
        if (oldRole.name !== newRole.name) {
            const embed = new EmbedBuilder()
                .setColor('#FFA500') // Orange for updates
                .setTitle('Role Updated')
                .addFields(
                    { name: 'Role', value: `${newRole.name} (${newRole.id})`, inline: true },
                    { name: 'Updated By', value: await getUpdater(newRole.guild), inline: true },
                    { name: 'Change', value: `**Name Changed:** \`${oldRole.name}\` → \`${newRole.name}\``, inline: false }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    },
};

// Function to fetch the executor (user) of the role update from audit logs
async function getUpdater(guild) {
    try {
        const auditLogs = await guild.fetchAuditLogs({ type: 31, limit: 1 }); // ROLE_UPDATE type
        const logEntry = auditLogs.entries.first();
        if (logEntry) {
            return `${logEntry.executor.tag} (${logEntry.executor.id})`;
        }
    } catch (error) {
        console.error('Error fetching audit logs for role update:', error);
    }
    return 'Unknown';
}
