// setLogChannel.js
module.exports = {
    name: 'setlogchannel',
    description: 'Sets the log channel.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

        // Check if a channel is mentioned
        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setlogchannel #channel\``);
        }

        // Set the log channel in config
        configHandler.setLogChannel(message.guild.id, channel.id);
        message.reply(`Log channel has been set to "${channel.name}".`);
    },
};
