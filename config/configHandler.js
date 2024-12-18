// setVerificationRole.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setverificationrole',
    description: 'Sets the verification role for the server.',
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

        // Command syntax: !setverificationrole @Role
        if (args.length !== 1) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setverificationrole @Role\``);
        }

        const roleMention = args[0];
        const role = message.mentions.roles.first();

        if (!role) {
            return message.reply('Please mention a valid role.');
        }

        // Set the verification role
        configHandler.setVerificationRole(role.name);
        message.reply(`✅ Verification role has been set to "${role.name}".`);
    },
};
