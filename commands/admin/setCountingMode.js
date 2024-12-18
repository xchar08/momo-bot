// setCountingMode.js
module.exports = {
    name: 'setcountingmode',
    description: 'Sets the counting mode for a counting channel.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = require('../../config/configHandler');

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

        // Command syntax: setcountingmode #channel <mode>
        if (args.length < 2) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}setcountingmode #channel <mode>\`\nAvailable modes: normal, hex, binary, count2, count3, count4, count5, countdown`);
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply('Please mention the counting channel you want to set the mode for.');
        }

        const modeInput = args[1].toLowerCase();
        const availableModes = ['normal', 'hex', 'binary', 'count2', 'count3', 'count4', 'count5', 'countdown'];

        if (!availableModes.includes(modeInput)) {
            return message.reply(`Invalid mode. Available modes: ${availableModes.join(', ')}`);
        }

        // Check if the channel is a counting channel
        const countingChannels = configHandler.getCountingChannels(message.guild.id);
        if (!countingChannels.includes(channel.id)) {
            return message.reply(`Channel ${channel} is not set as a counting channel. Use the \`setcountingchannel add #channel\` command to add it.`);
        }

        // Set the mode
        configHandler.setCountingMode(channel.id, modeInput);
        message.reply(`Counting mode for channel ${channel} has been set to **${modeInput}**.`);

        // Optionally, reset the count
        configHandler.resetCountingCount(channel.id);
    },
};
