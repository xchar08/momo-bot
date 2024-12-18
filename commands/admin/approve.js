const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'approve',
    description: 'Forcefully approves a member for a specific role and verifies them.',
    category: 'Ticket',
    async execute(message, args, client) {
        if (args.length < 2) {
            return message.reply('❌ Usage: `!approve @member <role>`');
        }

        const memberMention = message.mentions.members.first();
        const roleName = args.slice(1).join(' ');

        if (!memberMention) {
            return message.reply('❌ Please mention a valid member to approve.');
        }

        try {
            const guild = message.guild;

            // Check if the message is in a ticket channel
            const ticketChannelPrefix = 'ticket-';
            if (!message.channel.name.startsWith(ticketChannelPrefix)) {
                return message.reply('❌ This command can only be used in a ticket channel.');
            }

            // Assign or create the specified role
            let role = guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
            if (!role) {
                role = await guild.roles.create({
                    name: roleName,
                    color: '#3498db',
                    permissions: [],
                });
            }

            // Assign the role to the member
            await memberMention.roles.add(role);

            // Fetch and assign the verification role
            const verificationRoleId = configHandler.getVerificationRole();
            if (!verificationRoleId) {
                return message.reply('❌ Verification role is not set. Please set it using the `!setverifrole` command.');
            }

            const verificationRole = guild.roles.cache.get(verificationRoleId);
            if (!verificationRole) {
                return message.reply('❌ Verification role does not exist. Please contact an administrator.');
            }

            await memberMention.roles.add(verificationRole);

            // Move the ticket channel to the archive category
            const archiveCategoryName = configHandler.getArchiveCategory();
            const archiveCategory = guild.channels.cache.find(
                channel => channel.type === 4 && channel.name.toLowerCase() === archiveCategoryName.toLowerCase()
            );

            if (!archiveCategory) {
                return message.reply('❌ Archive category is not set or does not exist. Please set it using the `!setarchivecategory` command.');
            }

            await message.channel.setParent(archiveCategory.id);
            await message.channel.send(`✅ Approved ${memberMention.user.tag} for the role "${roleName}" and moved the ticket to the archive.`);
        } catch (error) {
            console.error('Error during approval:', error);
            message.reply('❌ An error occurred while approving the member.');
        }
    },
};
