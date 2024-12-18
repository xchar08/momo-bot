// roleDelete.js
const configHandler = require('../config/configHandler');

module.exports = {
    name: 'roleDelete',
    async execute(role, client) {
        // Define the naming convention used for club roles
        const clubRolePrefix = 'Club-';

        if (role.name.startsWith(clubRolePrefix)) {
            const clubName = role.name.substring(clubRolePrefix.length).trim();

            // Remove the club from config.json
            configHandler.removeClub(clubName);
            console.log(`Removed club "${clubName}" from config due to role deletion.`);
        }

        // Additionally, check if a deleted role is an officer role and handle accordingly
        const allClubs = configHandler.getAllClubs();
        for (const [clubName, clubConfig] of Object.entries(allClubs)) {
            if (clubConfig.officerRole === role.name) {
                // Optionally, notify admins or handle officer role deletion
                configHandler.removeOfficerRole(clubName);
                console.log(`Officer role "${role.name}" for club "${clubName}" was deleted. Updated config.`);
            }
        }
    },
};
