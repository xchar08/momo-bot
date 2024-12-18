// commands/admin/setAdminRole.js

module.exports = {
    name: 'setadminrole',
    description: 'Sets the admin role.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = client.configHandler;

        // Check if the user has the current admin role (if already set)
        const currentAdminRoleId = configHandler.getAdminRole();
        if (currentAdminRoleId) {
            if (!message.member.roles.cache.has(currentAdminRoleId)) {
                return message.reply('❌ You do not have permission to use this command.');
            }
        }

        // Check if a role is mentioned
        const role = message.mentions.roles.first();
        if (!role) {
            return message.reply(`❌ Usage: \`${configHandler.getPrefix(message.guild.id)}setadminrole @role\``);
        }

        try {
            // Set the admin role ID in config
            configHandler.setAdminRole(role.id);
            message.reply(`✅ Admin role has been set to "${role.name}".`);
        } catch (error) {
            console.error(`Error setting admin role:`, error);
            message.reply(`❌ Failed to set admin role: ${error.message}`);
        }
    },
};
