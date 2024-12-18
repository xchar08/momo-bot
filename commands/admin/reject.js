module.exports = {
    name: 'reject',
    description: 'Rejects the request in the ticket channel and moves it to the archive.',
    category: 'Ticket',
    async execute(message, args, client) {
        if (args.length < 1) {
            return message.reply('❌ Usage: `!reject <reason>`');
        }

        const reason = args.join(' ');

        try {
            // Check if the message is in a ticket channel
            const ticketChannelPrefix = 'ticket-';
            if (!message.channel.name.startsWith(ticketChannelPrefix)) {
                return message.reply('❌ This command can only be used in a ticket channel.');
            }

            // Move the ticket channel to the archive category
            const archiveCategoryName = configHandler.getArchiveCategory();
            const archiveCategory = message.guild.channels.cache.find(
                channel => channel.type === 4 && channel.name.toLowerCase() === archiveCategoryName.toLowerCase()
            );

            if (!archiveCategory) {
                return message.reply('❌ Archive category is not set or does not exist. Please set it using the `!setarchivecategory` command.');
            }

            await message.channel.setParent(archiveCategory.id);
            await message.channel.send(`❌ Request rejected.\nReason: ${reason}\nMoved the ticket to the archive.`);
        } catch (error) {
            console.error('Error during rejection:', error);
            message.reply('❌ An error occurred while rejecting the request.');
        }
    },
};
