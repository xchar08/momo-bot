// roleCreate.js
const configHandler = require('../config/configHandler');

module.exports = {
    name: 'roleCreate',
    async execute(role, client) {
        // Define a naming convention for club roles, e.g., roles starting with "Club-"
        const clubRolePrefix = 'Club-';

        if (role.name.startsWith(clubRolePrefix)) {
            const clubName = role.name.substring(clubRolePrefix.length).trim();

            // Check if the club already exists to prevent duplicates
            const existingClub = configHandler.getClubConfig(clubName);
            if (existingClub) {
                console.log(`Club "${clubName}" already exists in config.`);
                return;
            }

            // Create a default officer role name, e.g., "ClubName Officer"
            const officerRoleName = `${clubName} Officer`;

            // Check if the officer role already exists
            let officerRole = role.guild.roles.cache.find(r => r.name === officerRoleName);
            if (!officerRole) {
                try {
                    officerRole = await role.guild.roles.create({
                        name: officerRoleName,
                        color: 'BLUE',
                        reason: `Officer role for ${clubName}`,
                    });
                    console.log(`Created officer role "${officerRoleName}" for club "${clubName}".`);
                } catch (error) {
                    console.error(`Error creating officer role for club "${clubName}":`, error);
                    return;
                }
            }

            // Add the new club to config.json
            configHandler.addClub(clubName, officerRoleName, []);
            console.log(`Added club "${clubName}" with officer role "${officerRoleName}" to config.`);
        }
    },
};
