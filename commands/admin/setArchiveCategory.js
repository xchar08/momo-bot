const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setarchivecategory',
    description: 'Sets the archive category for the server.',
    category: 'Admin',
    async execute(message, args, client) {
        // Check if the user has the admin role
        const adminRoleId = configHandler.getAdminRole();
        if (!adminRoleId) {
            return message.reply('❌ Admin role is not set. Please set it using the `!setadminrole` command.');
        }

        if (!message.member.roles.cache.has(adminRoleId)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Validate command arguments
        if (args.length < 1) {
            return message.reply('❌ Please specify the name of the category.\nUsage: `!setarchivecategory <category name>`');
        }

        const categoryName = args.join(' '); // Combine arguments for multi-word names

        // Search for the category by name
        const category = message.guild.channels.cache.find(
            channel => channel.type === 4 && channel.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!category) {
            return message.reply(`❌ No category with the name "${categoryName}" was found.`);
        }

        // Save the category name in the config
        configHandler.setArchiveCategory(category.name);
        message.reply(`✅ Archive category has been set to "${category.name}".`);
    },
};
