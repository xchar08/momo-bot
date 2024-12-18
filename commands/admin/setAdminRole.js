// setAdminRole.js
module.exports = {
    name: 'setadminrole',
    description: 'Sets the admin role.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a role is mentioned
        const role = message.mentions.roles.first();
        if (!role) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setadminrole @role\``);
        }

        // Set the admin role in config
        configHandler.setAdminRole(role.name);
        message.reply(`Admin role has been set to "${role.name}".`);
    },
};
