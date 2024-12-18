// ticket.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'ticket',
    description: 'Creates a ticket channel for admin approval of officer roles.',
    category: 'Ticket',
    async execute(message, args, client) {
        // Command syntax: ticket <club name> @member <IRL name>
        if (args.length < 2) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}ticket <club name> @member <IRL name>\``);
        }

        const clubName = args[0];
        const memberMention = args[1];
        const irlName = args.slice(2).join(' ');

        if (!irlName) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}ticket <club name> @member <IRL name>\``);
        }

        // Fetch club configuration
        const clubConfig = configHandler.getClubConfig(clubName);
        if (!clubConfig) {
            return message.reply(`Club "${clubName}" does not exist.`);
        }

        // Fetch the member to verify
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member to verify.');
        }

        // Create a ticket channel under Collaborations category
        const collabCategoryId = configHandler.config.collabCategoryId;
        const collabCategory = message.guild.channels.cache.get(collabCategoryId);
        if (!collabCategory || collabCategory.type !== 'GUILD_CATEGORY') {
            return message.reply('Collaborations category does not exist or is not a category. Please check your config.');
        }

        try {
            const ticketChannel = await message.guild.channels.create(`ticket-${member.user.username}`, {
                type: 'GUILD_TEXT',
                parent: collabCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: configHandler.getAdminRole(),
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS'],
                    },
                    {
                        id: member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    }
                ],
            });

            ticketChannel.send(`Approval needed for verifying **${member.user.tag}** in **${clubName}**.\nPlease provide IRL name: **${irlName}**.\n\nAdmins can use \`${configHandler.getPrefix(message.guild.id)}approve @member <role>\` or \`${configHandler.getPrefix(message.guild.id)}reject <reason>\`.`);

            message.reply(`Ticket channel created: ${ticketChannel}`);
        } catch (error) {
            console.error('Error creating ticket channel:', error);
            message.reply('An error occurred while creating the ticket channel.');
        }
    },
};
