const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'roleDelete',
    async execute(role, client) {
        const configHandler = client.configHandler;

        // Fetch audit logs to determine who deleted the role
        let deletedBy = 'Unknown';
        try {
            const auditLogs = await role.guild.fetchAuditLogs({
                type: 32, // ROLE_DELETE
                limit: 1,
            });

            const roleLog = auditLogs.entries.first();

            if (roleLog && roleLog.target.id === role.id) {
                deletedBy = `${roleLog.executor.tag} (${roleLog.executor.id})`;
            }
        } catch (error) {
            console.error('Error fetching audit logs for role deletion:', error);
        }

        // Handle club-specific roles
        let clubMessage = null;
        if (role.name.startsWith('club-')) {
            const clubName = role.name.substring(5).toLowerCase();

            if (configHandler.getAllClubs()[clubName]) {
                try {
                    configHandler.removeClub(clubName);
                    clubMessage = `❌ Club "${clubName}" removed from configuration (Deleted Role: "${role.name}").`;
                    console.log(`Club "${clubName}" removed from configuration due to role deletion.`);
                } catch (error) {
                    console.error(`Error removing club "${clubName}":`, error);
                }
            }
        }

        // Get the role permissions in human-readable form
        const permissions = new PermissionsBitField(role.permissions).toArray().join(', ') || 'No permissions';

        // Fetch the log channel
        const logChannelId = configHandler.getLogChannel(role.guild.id);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Build the embed
        const embed = new EmbedBuilder()
            .setColor('#FF0000') // Red for deletion
            .setTitle('Role Deleted')
            .addFields(
                { name: 'Role Name', value: `${role.name} (${role.id})`, inline: true },
                { name: 'Deleted By', value: deletedBy, inline: true },
                { name: 'Permissions', value: permissions, inline: false },
                { name: 'Timestamp', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false }
            )
            .setTimestamp();

        // Send the log with the optional club message
        try {
            if (clubMessage) {
                await logChannel.send(clubMessage);
            }
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending roleDelete log:', error);
        }
    },
};
