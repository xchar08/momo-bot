// events/roleDelete.js

module.exports = {
    name: 'roleDelete',
    execute(role, client) {
        const configHandler = client.configHandler;
        const clubName = role.name.toLowerCase().replace('club-', '');

        // Check if the deleted role corresponds to a club
        const allClubs = configHandler.getAllClubs();
        const clubExists = Object.keys(allClubs).includes(clubName);

        if (clubExists) {
            try {
                configHandler.removeClub(clubName);
                console.log(`Club "${clubName}" has been removed from configuration due to role deletion.`);
                // Optionally, notify a log channel
                const logChannelId = configHandler.getLogChannel(role.guild.id);
                if (logChannelId) {
                    const logChannel = role.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        logChannel.send(`🔔 Club "${clubName}" has been removed from configuration because the role "${role.name}" was deleted.`);
                    }
                }
            } catch (error) {
                console.error(`Error removing club "${clubName}":`, error);
            }
        }
    },
};
