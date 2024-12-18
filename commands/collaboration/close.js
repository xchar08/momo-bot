const configHandler = require('../../config/configHandler');
const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'close',
    description: 'Moves the collaboration channel to the archive category.',
    category: 'Collaboration',
    async execute(message, args, client) {
        // Check if the user has the admin role
        const adminRoleId = configHandler.getAdminRole();
        if (!adminRoleId) {
            return message.reply('❌ Admin role is not set. Please set it using the `!setadminrole` command.');
        }

        if (!message.member.roles.cache.has(adminRoleId)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Ensure the command is used in a text channel
        if (message.channel.type !== ChannelType.GuildText) {
            return message.reply('❌ This command can only be used in a text channel.');
        }

        // Fetch the archive category
        const archiveCategoryName = configHandler.getArchiveCategory();
        const archiveCategory = message.guild.channels.cache.find(
            channel =>
                channel.type === ChannelType.GuildCategory &&
                channel.name.toLowerCase() === archiveCategoryName.toLowerCase()
        );

        if (!archiveCategory) {
            return message.reply('❌ Archive category does not exist or is not set. Please set it using the `!setarchivecategory` command.');
        }

        try {
            // Move the channel to the archive category
            await message.channel.setParent(archiveCategory.id, { lockPermissions: false });

            // Confirm the action
            message.reply(`✅ Channel "${message.channel.name}" has been moved to the archive category.`);
        } catch (error) {
            console.error('Error moving channel to archive category:', error);
            message.reply('❌ An error occurred while moving the channel to the archive category.');
        }
    },
};
