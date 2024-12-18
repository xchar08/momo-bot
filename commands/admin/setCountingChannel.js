// setCountingChannel.js
module.exports = {
    name: 'setcountingchannel',
    description: 'Adds, removes, or lists a counting channel.',
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

        // Command syntax:
        // To add: setcountingchannel add #channel
        // To remove: setcountingchannel remove #channel
        // To list: setcountingchannel list
        if (args.length === 0) {
            return message.reply(`Usage:\n\`${configHandler.getPrefix(message.guild.id)}setcountingchannel add #channel\` to add a counting channel.\n\`${configHandler.getPrefix(message.guild.id)}setcountingchannel remove #channel\` to remove a counting channel.\n\`${configHandler.getPrefix(message.guild.id)}setcountingchannel list\` to list all counting channels.`);
        }

        const subCommand = args[0].toLowerCase();
        const channel = message.mentions.channels.first();

        if (subCommand === 'add') {
            if (!channel) {
                return message.reply('Please mention the channel you want to add as a counting channel.');
            }

            // Add the channel
            configHandler.addCountingChannel(message.guild.id, channel.id);
            message.reply(`Channel ${channel} has been added as a counting channel.`);
        } else if (subCommand === 'remove') {
            if (!channel) {
                return message.reply('Please mention the channel you want to remove from counting channels.');
            }

            // Remove the channel
            configHandler.removeCountingChannel(message.guild.id, channel.id);
            message.reply(`Channel ${channel} has been removed from counting channels.`);
        } else if (subCommand === 'list') {
            const countingChannels = configHandler.getCountingChannels(message.guild.id);
            if (countingChannels.length === 0) {
                return message.reply('No counting channels have been set.');
            }

            const channels = countingChannels.map(id => `<#${id}>`).join(', ');
            message.reply(`Counting Channels: ${channels}`);
        } else {
            return message.reply(`Invalid subcommand. Use \`${configHandler.getPrefix(message.guild.id)}setcountingchannel add/remove/list\`.`);
        }
    },
};
