// events/roleDelete.js
module.exports = {
    name: 'roleDelete',
    execute(role, client) {
        const configHandler = client.configHandler;

        if (role.name.startsWith('club-')) {
            const clubName = role.name.substring(5).toLowerCase();

            if (configHandler.getAllClubs()[clubName]) {
                try {
                    configHandler.removeClub(clubName);
                    console.log(`Club "${clubName}" removed from configuration due to role deletion.`);

                    const logChannelId = configHandler.getLogChannel(role.guild.id);
                    if (logChannelId) {
                        const logChannel = role.guild.channels.cache.get(logChannelId);
                        if (logChannel) {
                            logChannel.send(`❌ Club "${clubName}" removed from configuration (Deleted Role: "${role.name}").`);
                        }
                    }
                } catch (error) {
                    console.error(`Error removing club "${clubName}":`, error);
                }
            }
        }
    },
};
