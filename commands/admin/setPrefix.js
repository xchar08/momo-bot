// setPrefix.js
module.exports = {
    name: 'setprefix',
    description: 'Sets a new command prefix.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a new prefix is provided
        if (args.length < 1) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setprefix <new_prefix>\``);
        }

        const newPrefix = args[0];

        // Optional: Validate prefix (e.g., length, characters)
        if (newPrefix.length > 5) {
            return message.reply('Prefix too long. Please choose a prefix with 5 or fewer characters.');
        }

        // Set the new prefix in config
        configHandler.setPrefix(message.guild.id, newPrefix);
        message.reply(`Command prefix has been set to "${newPrefix}".`);
    },
};
