// setLogChannel.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'setlogchannel',
    description: 'Sets the log channel for the server.',
    category: 'Admin',
    async execute(message, args, client) {
        // Check if the user has the admin role
        const adminRoleName = configHandler.getAdminRole();
        if (!adminRoleName) {
            return message.reply('Admin role is not set. Please set it using the `setadminrole` command.');
        }

        const adminRole = message.guild.roles.cache.find(r => r.name === adminRoleName);
        if (!adminRole) {
            return message.reply(`Admin role "${adminRoleName}" does not exist.`);
        }

        if (!message.member.roles.cache.has(adminRole.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        // Command syntax: !setlogchannel #channel
        if (args.length !== 1) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setlogchannel #channel\``);
        }

        const channelMention = args[0];
        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply('Please mention a valid channel.');
        }

        // Set the log channel
        configHandler.setLogChannel(message.guild.id, channel.id);
        message.reply(`✅ Log channel has been set to "${channel.name}".`);
    },
};
