const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'roleCreate',
    async execute(role, client) {
        const configHandler = client.configHandler;

        // Fetch the audit logs to get accurate details of the created role
        let createdBy = 'Unknown';
        let roleName = role.name || 'Unknown';
        let permissions = 'Unknown';

        try {
            const auditLogs = await role.guild.fetchAuditLogs({
                type: 30, // ROLE_CREATE
                limit: 1,
            });

            const roleLog = auditLogs.entries.first();

            if (roleLog) {
                if (roleLog.target.id === role.id) {
                    createdBy = `${roleLog.executor.tag} (${roleLog.executor.id})`;
                    roleName = roleLog.target.name || 'Unknown';
                    permissions = new PermissionsBitField(roleLog.target.permissions).toArray().join(', ') || 'No permissions';
                }
            } else {
                console.warn('No relevant audit log entry found for role creation.');
            }
        } catch (error) {
            console.error('Error fetching audit logs for role creation:', error);
        }

        // Handle club-specific roles
        let clubMessage = null;
        if (roleName.startsWith('club-')) {
            const clubName = roleName.substring(5).toLowerCase();

            if (!configHandler.getAllClubs()[clubName]) {
                try {
                    configHandler.addClub(clubName);
                    clubMessage = `✅ Club "${clubName}" added to configuration (Created Role: "${roleName}").`;
                    console.log(`Club "${clubName}" added to configuration due to role creation.`);
                } catch (error) {
                    console.error(`Error adding club "${clubName}":`, error);
                }
            }
        }

        // Fetch the log channel
        const logChannelId = configHandler.getLogChannel(role.guild.id);
        if (!logChannelId) return;

        const logChannel = role.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Build the embed
        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Green for creation
            .setTitle('Role Created')
            .addFields(
                { name: 'Role Name', value: `${roleName} (${role.id})`, inline: true },
                { name: 'Created By', value: createdBy, inline: true },
                { name: 'Permissions', value: permissions, inline: false },
                { name: 'Timestamp', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: false }
            )
            .setTimestamp();

        // Send the log with the optional club message
        try {
            if (clubMessage) {
                await logChannel.send(clubMessage);
            }
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending roleCreate log:', error);
        }
    },
};
