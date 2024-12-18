// setVerifRole.js
module.exports = {
    name: 'setverifrole',
    description: 'Sets the verification role.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a role is mentioned
        const role = message.mentions.roles.first();
        if (!role) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setverifrole @role\``);
        }

        // Set the verification role in config
        configHandler.setVerificationRole(role.name);
        message.reply(`Verification role has been set to "${role.name}".`);
    },
};
