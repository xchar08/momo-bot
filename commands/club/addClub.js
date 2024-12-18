// addClub.js
module.exports = {
    name: 'addclub',
    description: 'Adds a new club with specified configurations.',
    category: 'Club',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

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

        // Command syntax: addclub <club name> <max officers> <officer roles (comma-separated)> <additional roles (comma-separated)>
        if (args.length < 4) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}addclub <club name> <max officers> <officer roles (comma-separated)> <additional roles (comma-separated)>\``);
        }

        const clubName = args[0];
        const maxOfficers = parseInt(args[1]);
        if (isNaN(maxOfficers) || maxOfficers <= 0) {
            return message.reply('Please provide a valid number for maximum officers.');
        }

        const officerRolesInput = args[2];
        const officerRoles = officerRolesInput.split(',').map(r => r.trim()).filter(r => r.length > 0);
        if (officerRoles.length === 0) {
            return message.reply('Please provide at least one officer role.');
        }

        const additionalRolesInput = args.slice(3).join(' ');
        const additionalRoles = additionalRolesInput.split(',').map(r => r.trim()).filter(r => r.length > 0);
        if (additionalRoles.length < 2) {
            return message.reply('Please provide at least two additional roles.');
        }

        // Validate that all roles exist
        const invalidOfficerRoles = officerRoles.filter(role => !message.guild.roles.cache.find(r => r.name === role));
        const invalidAdditionalRoles = additionalRoles.filter(role => !message.guild.roles.cache.find(r => r.name === role));

        if (invalidOfficerRoles.length > 0) {
            return message.reply(`The following officer roles do not exist: ${invalidOfficerRoles.join(', ')}`);
        }

        if (invalidAdditionalRoles.length > 0) {
            return message.reply(`The following additional roles do not exist: ${invalidAdditionalRoles.join(', ')}`);
        }

        // Check if club already exists
        if (configHandler.getClubConfig(clubName)) {
            return message.reply(`Club "${clubName}" already exists.`);
        }

        // Add the club
        configHandler.addClub(clubName, maxOfficers, officerRoles, additionalRoles);
        message.reply(`Club "${clubName}" has been added successfully with a maximum of ${maxOfficers} officers.`);
    },
};
