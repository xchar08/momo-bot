// events/messageCreate.js

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore messages from bots
        if (message.author.bot) return;

        const configHandler = client.configHandler;
        const prefix = configHandler.getPrefix(message.guild.id) || '!';

        // Check if the message starts with the prefix
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ There was an error trying to execute that command!');
        }
    },
};
