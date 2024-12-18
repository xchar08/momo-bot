// commands/admin/setUnverifiedRole.js

module.exports = {
    name: 'setunverifiedrole',
    description: 'Sets the Unverified role for the server.',
    category: 'Admin',
    usage: '!setunverifiedrole @Role',
    args: true,
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

        // Parse the role mention
        const roleMention = message.mentions.roles.first();
        if (!roleMention) {
            return message.reply('❌ Please mention the role you want to set as the Unverified role.\nUsage: `!setunverifiedrole @Role`');
        }

        try {
            // Set the Unverified role in the configuration
            configHandler.setUnverifiedRole(roleMention.id);

            message.channel.send(`✅ The Unverified role has been set to **${roleMention.name}**.`);
        } catch (error) {
            console.error(`Error setting Unverified role:`, error);
            message.reply(`❌ An error occurred while setting the Unverified role: ${error.message}`);
        }
    },
};
