// events/roleCreate.js

module.exports = {
    name: 'roleCreate',
    execute(role, client) {
        const configHandler = client.configHandler;
        const clubRolePrefix = 'club-';
        const roleNameLower = role.name.toLowerCase();

        if (roleNameLower.startsWith(clubRolePrefix)) {
            const clubName = roleNameLower.replace(clubRolePrefix, '');

            const allClubs = configHandler.getAllClubs();
            const clubExists = Object.keys(allClubs).includes(clubName);

            if (!clubExists) {
                try {
                    configHandler.addClub(clubName);
                    console.log(`Club "${clubName}" has been added to configuration due to role creation.`);
                    // Optionally, notify a log channel
                    const logChannelId = configHandler.getLogChannel(role.guild.id);
                    if (logChannelId) {
                        const logChannel = role.guild.channels.cache.get(logChannelId);
                        if (logChannel) {
                            logChannel.send(`🔔 Club "${clubName}" has been added to configuration because the role "${role.name}" was created.`);
                        }
                    }
                } catch (error) {
                    console.error(`Error adding club "${clubName}":`, error);
                }
            }
        }
    },
};
