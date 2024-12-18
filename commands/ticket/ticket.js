// ticket.js
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
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
        const memberMention = message.mentions.members.first();
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
        if (!memberMention) {
            return message.reply('Please mention a valid member to verify.');
        }

        const member = memberMention;

        // Create a ticket channel under Collaborations category
        const collabCategoryId = configHandler.config.collabCategoryId;
        const collabCategory = message.guild.channels.cache.get(collabCategoryId);
        if (!collabCategory || collabCategory.type !== 4) { // 4 is GUILD_CATEGORY in Discord.js v14
            return message.reply('Collaborations category does not exist or is not a category. Please check your config.');
        }

        try {
            const ticketChannel = await message.guild.channels.create({
                name: `ticket-${member.user.username}`,
                type: 0, // 0 is GUILD_TEXT in Discord.js v14
                parent: collabCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: configHandler.getAdminRole(),
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                    },
                    {
                        id: member.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    }
                ],
            });

            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('Officer Role Approval Needed')
                .addFields(
                    { name: 'Club', value: clubName, inline: true },
                    { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                    { name: 'IRL Name', value: irlName, inline: false },
                    { name: 'Instructions', value: `Admins can use \`${configHandler.getPrefix(message.guild.id)}approve @member <role>\` or \`${configHandler.getPrefix(message.guild.id)}reject <reason>\`.` }
                )
                .setTimestamp();

            ticketChannel.send({ embeds: [embed] });

            message.reply(`Ticket channel created: ${ticketChannel}`);
        } catch (error) {
            console.error('Error creating ticket channel:', error);
            message.reply('An error occurred while creating the ticket channel.');
        }
    },
};
