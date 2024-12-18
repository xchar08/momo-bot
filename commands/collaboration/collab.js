const configHandler = require('../../config/configHandler');
const schedule = require('node-schedule');
const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'collab',
    description: 'Creates a temporary collaboration channel for planning events or divisions.',
    category: 'Collaboration',
    async execute(message, args, client) {
        if (args.length < 2) {
            return message.reply(
                `Usage: \`${configHandler.getPrefix(message.guild.id)}collab <club1,club2,club3(optional)> <event>\``
            );
        }

        const input = args.join(' ');
        const [clubsInput, eventName] = input.split(/ (.+)/);

        if (!eventName) {
            return message.reply(
                '❌ Please specify an event or division name. Example: `!collab club1,club2 "Annual Meetup"`'
            );
        }

        const clubNames = clubsInput
            .split(',')
            .map(club => club.trim())
            .filter(club => club.length > 0);

        // Validate clubs
        const allClubs = configHandler.getAllClubs();
        const invalidClubs = clubNames.filter(club => !allClubs[club]);
        if (invalidClubs.length > 0) {
            return message.reply(`❌ The following clubs do not exist: ${invalidClubs.join(', ')}`);
        }

        // Fetch the collaboration category
        const collabCategoryName = configHandler.getCollabCategory();
        const collabCategory = message.guild.channels.cache.find(
            channel =>
                channel.type === ChannelType.GuildCategory &&
                channel.name.toLowerCase() === collabCategoryName.toLowerCase()
        );

        if (!collabCategory) {
            return message.reply(
                '❌ Collaborations category is not set or does not exist. Please set it using the `!setcollabcategory` command.'
            );
        }

        try {
            // Fetch all members from specified clubs
            const membersToInclude = [];
            for (const club of clubNames) {
                const clubMembers = allClubs[club]?.members || {};
                for (const memberId of Object.values(clubMembers)) {
                    const member = await message.guild.members.fetch(memberId).catch(() => null);
                    if (member && !membersToInclude.includes(member.id)) {
                        membersToInclude.push(member.id);
                    }
                }
            }

            // Create the collaboration channel
            const collabChannel = await message.guild.channels.create({
                name: `collab-${eventName.toLowerCase().replace(/\s+/g, '-')}`,
                type: ChannelType.GuildText,
                parent: collabCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    // Add permissions for each member in the specified clubs
                    ...membersToInclude.map(memberId => ({
                        id: memberId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    })),
                    // Allow admins
                    (() => {
                        const adminRoleId = configHandler.getAdminRole();
                        const adminRole = message.guild.roles.cache.get(adminRoleId);
                        if (adminRole) {
                            return {
                                id: adminRole.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ManageChannels,
                                ],
                            };
                        }
                        return null;
                    })(),
                ].filter(Boolean),
            });

            collabChannel.send(
                `Collaboration Channel for **${eventName}** involving clubs: ${clubNames.join(', ')}.\nDiscuss and plan your event here.\n\nAdmins can use \`!close\` to archive this channel.`
            );

            message.reply(`✅ Collaboration channel created: ${collabChannel}`);

            // Schedule channel deletion after 7 days
            const deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
            schedule.scheduleJob(deletionDate, async () => {
                try {
                    await collabChannel.delete('Collaboration planning period ended.');
                    const logChannelId = configHandler.getLogChannel(message.guild.id);
                    if (logChannelId) {
                        const logChannel = message.guild.channels.cache.get(logChannelId);
                        if (logChannel) {
                            logChannel.send(
                                `✅ Collaboration channel "${collabChannel.name}" has been deleted after the planning period.`
                            );
                        }
                    }
                } catch (error) {
                    console.error('Error deleting collaboration channel:', error);
                }
            });
        } catch (error) {
            console.error('Error creating collaboration channel:', error);
            message.reply('❌ An error occurred while creating the collaboration channel.');
        }
    },
};
