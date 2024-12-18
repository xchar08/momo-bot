// messageCreate.js
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore messages from bots or without guild
        if (!message.guild || message.author.bot) return;

        const configHandler = require('../config/configHandler');
        const prefix = configHandler.getPrefix(message.guild.id);

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('There was an error executing that command.');
        }
    },
};
