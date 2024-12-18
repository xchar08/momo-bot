// setArchiveCategory.js
module.exports = {
    name: 'setarchivecategory',
    description: 'Sets the archive category.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a category is mentioned
        const category = message.mentions.channels.first();
        if (!category || category.type !== 'GUILD_CATEGORY') {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setarchivecategory #category\``);
        }

        // Set the archive category in config
        configHandler.setArchiveCategory(category.id);
        message.reply(`Archive category has been set to "${category.name}".`);
    },
};
