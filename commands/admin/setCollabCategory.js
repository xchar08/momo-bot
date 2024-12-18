// setCollabCategory.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setcollabcategory',
    description: 'Sets the collaboration category for the server.',
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

        // Command syntax: !setcollabcategory #category
        if (args.length !== 1) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setcollabcategory #category\``);
        }

        const categoryMention = args[0];
        const category = message.mentions.channels.first();

        if (!category || category.type !== 'GUILD_CATEGORY') {
            return message.reply('Please mention a valid category.');
        }

        // Set the collaboration category
        configHandler.setCollabCategory(category.id);
        message.reply(`✅ Collaboration category has been set to "${category.name}".`);
    },
};
