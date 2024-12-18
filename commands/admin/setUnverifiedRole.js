// commands/admin/setVerifRole.js

module.exports = {
    name: 'setverifrole',
    description: 'Sets the verification role.',
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

        // Check if a role is mentioned
        const role = message.mentions.roles.first();
        if (!role) {
            return message.reply(`❌ Usage: \`${configHandler.getPrefix(message.guild.id)}setverifrole @role\``);
        }

        try {
            // Set the verification role ID in config
            configHandler.setVerificationRole(role.id);
            message.reply(`✅ Verification role has been set to "${role.name}".`);
        } catch (error) {
            console.error(`Error setting verification role:`, error);
            message.reply(`❌ Failed to set verification role: ${error.message}`);
        }
    },
};
