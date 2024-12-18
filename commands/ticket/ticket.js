const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'ticket',
    description: 'Creates a ticket channel for admin approval of officer roles.',
    category: 'Ticket',
    async execute(message, args, client) {
        if (args.length < 2) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}ticket <club> @member <IRL name>\``);
        }

        const clubName = args[0].toLowerCase();
        const memberMention = message.mentions.members.first();
        const irlName = args.slice(2).join(' ');

        if (!irlName) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}ticket <club> @member <IRL name>\``);
        }

        const allClubs = configHandler.getAllClubs();
        if (!allClubs[clubName]) {
            return message.reply(`❌ Club "${clubName}" does not exist.`);
        }

        if (!memberMention) {
            return message.reply('❌ Please mention a valid member to verify.');
        }

        const ticketCategoryName = configHandler.getTicketCategory();
        const ticketCategory = message.guild.channels.cache.find(
            channel => channel.type === 4 && channel.name.toLowerCase() === ticketCategoryName.toLowerCase()
        );

        if (!ticketCategory) {
            return message.reply('❌ Ticket category does not exist or is not set. Please set it using the `!setticketcategory` command.');
        }

        try {
            const ticketChannel = await message.guild.channels.create({
                name: `ticket-${memberMention.user.username}`,
                type: 0,
                parent: ticketCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: configHandler.getAdminRole(),
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ManageChannels,
                        ],
                    },
                    {
                        id: memberMention.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('Officer Role Approval Needed')
                .addFields(
                    { name: 'Club', value: clubName, inline: true },
                    { name: 'Member', value: `${memberMention.user.tag} (${memberMention.id})`, inline: true },
                    { name: 'IRL Name', value: irlName, inline: false },
                    { name: 'Instructions', value: `Admins can use \`${configHandler.getPrefix(message.guild.id)}approve @member <role>\` or \`${configHandler.getPrefix(message.guild.id)}reject <reason>\`.` }
                )
                .setTimestamp();

            await ticketChannel.send({ embeds: [embed] });
            message.reply(`✅ Ticket channel created: ${ticketChannel}`);
        } catch (error) {
            console.error('Error creating ticket channel:', error);
            message.reply('❌ An error occurred while creating the ticket channel.');
        }
    },
};
