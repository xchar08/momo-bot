// commands/admin/addClub.js

module.exports = {
    name: 'addclub',
    description: 'Adds a new club to the configuration.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = client.configHandler;

        // Check if the user has the admin role
        const adminRoleId = configHandler.getAdminRole();
        if (adminRoleId) {
            if (!message.member.roles.cache.has(adminRoleId)) {
                return message.reply('❌ You do not have permission to use this command.');
            }
        } else {
            return message.reply('❌ Admin role is not set. Please set it using the `!setadminrole` command.');
        }

        // Parse arguments
        const clubName = args[0]?.toLowerCase();

        // Validate input
        if (!clubName) {
            return message.reply(`❌ Please provide a club name.\nUsage: \`${configHandler.getPrefix(message.guild.id)}addclub <clubName>\``);
        }

        try {
            // Add the club using configHandler
            configHandler.addClub(clubName);
            message.channel.send(`✅ Club "${clubName}" has been successfully created.`);
        } catch (error) {
            console.error(`Error creating club "${clubName}":`, error);
            message.reply(`❌ Error creating club "${clubName}": ${error.message}`);
        }
    },
};
