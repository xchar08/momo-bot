// setAdminRole.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setadminrole',
    description: 'Sets the admin role for the server.',
    category: 'Admin',
    async execute(message, args, client) {
        // Check if the user has the admin role (to set admin role, user needs higher privileges)
        const adminRoleName = configHandler.getAdminRole();
        if (adminRoleName) {
            const adminRole = message.guild.roles.cache.find(r => r.name === adminRoleName);
            if (adminRole && !message.member.roles.cache.has(adminRole.id)) {
                return message.reply('You do not have permission to use this command.');
            }
        }

        // Command syntax: !setadminrole @Role
        if (args.length !== 1) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setadminrole @Role\``);
        }

        const roleMention = args[0];
        const role = message.mentions.roles.first();

        if (!role) {
            return message.reply('Please mention a valid role.');
        }

        // Set the admin role
        configHandler.setAdminRole(role.name);
        message.reply(`✅ Admin role has been set to "${role.name}".`);
    },
};
