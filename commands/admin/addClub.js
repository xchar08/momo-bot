// addClub.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'addclub',
    description: 'Adds a new club with specific configurations.',
    category: 'Admin',
    async execute(message, args, client) {
        // Check if the user has the admin role
        const adminRoleName = configHandler.getAdminRole();
        if (!adminRoleName) {
            return message.reply('Admin role is not set. Please set it using the `setadminrole` command.');
        }

        const adminRole = message.guild.roles.cache.find(r => r.name === adminRoleName);
        if (!adminRole) {
            return message.reply(`Admin role "${adminRoleName}" does not exist.`);
        }

        if (!message.member.roles.cache.has(adminRole.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        // Command syntax: !addclub <club name> <additional roles (comma-separated)>
        if (args.length < 2) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}addclub <club name> <additional roles (comma-separated)>\``);
        }

        const clubName = args[0];
        const additionalRoles = args.slice(1).join(' ').split(',').map(role => role.trim());

        // Define the club role name with the prefix
        const clubRolePrefix = 'Club-';
        const clubRoleName = `${clubRolePrefix}${clubName}`;

        // Check if the club already exists
        if (configHandler.getClubConfig(clubName)) {
            return message.reply(`Club "${clubName}" already exists.`);
        }

        // Check if the club role already exists
        let clubRole = message.guild.roles.cache.find(r => r.name === clubRoleName);
        if (!clubRole) {
            try {
                clubRole = await message.guild.roles.create({
                    name: clubRoleName,
                    color: 'GREEN',
                    reason: `Role for the "${clubName}" club`,
                });
                message.reply(`Created club role "${clubRoleName}".`);
            } catch (error) {
                console.error(`Error creating club role "${clubRoleName}":`, error);
                return message.reply('❌ There was an error creating the club role. Please try again.');
            }
        }

        // Define the officer role name
        const officerRoleName = `${clubName} Officer`;

        // Check if the officer role exists
        let officerRole = message.guild.roles.cache.find(r => r.name === officerRoleName);
        if (!officerRole) {
            try {
                officerRole = await message.guild.roles.create({
                    name: officerRoleName,
                    color: 'BLUE',
                    reason: `Officer role for the "${clubName}" club`,
                });
                message.reply(`Created officer role "${officerRoleName}" for club "${clubName}".`);
            } catch (error) {
                console.error(`Error creating officer role "${officerRoleName}":`, error);
                return message.reply('❌ There was an error creating the officer role. Please try again.');
            }
        }

        // Check if additional roles exist
        for (const roleName of additionalRoles) {
            const role = message.guild.roles.cache.find(r => r.name === roleName);
            if (!role) {
                return message.reply(`Additional role "${roleName}" does not exist. Please create it first.`);
            }
        }

        // Add the club to config.json
        configHandler.addClub(clubName, officerRoleName, additionalRoles);
        message.reply(`Club "${clubName}" has been added with officer role "${officerRoleName}".`);
    },
};
