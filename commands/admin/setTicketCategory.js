const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setticketcategory',
    description: 'Sets the ticket category for the server.',
    category: 'Admin',
    async execute(message, args, client) {
        const adminRoleId = configHandler.getAdminRole();
        if (!adminRoleId) {
            return message.reply('❌ Admin role is not set. Please set it using the `!setadminrole` command.');
        }

        if (!message.member.roles.cache.has(adminRoleId)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        if (args.length < 1) {
            return message.reply('❌ Please specify the name of the category.\nUsage: `!setticketcategory <category name>`');
        }

        const categoryName = args.join(' ');
        const category = message.guild.channels.cache.find(
            channel => channel.type === 4 && channel.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!category) {
            return message.reply(`❌ No category with the name "${categoryName}" was found.`);
        }

        configHandler.setTicketCategory(category.name);
        message.reply(`✅ Ticket category has been set to "${category.name}".`);
    },
};
