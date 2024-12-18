// setCollabCategory.js
module.exports = {
    name: 'setcollabcategory',
    description: 'Sets the collaboration category.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a category is mentioned
        const category = message.mentions.channels.first();
        if (!category || category.type !== 'GUILD_CATEGORY') {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setcollabcategory #category\``);
        }

        // Set the collaboration category in config
        configHandler.setCollabCategory(category.id);
        message.reply(`Collaboration category has been set to "${category.name}".`);
    },
};
