// collab.js
const configHandler = require('../../config/configHandler');
const schedule = require('node-schedule');
const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'collab',
    description: 'Creates a temporary collaboration channel for planning events or divisions.',
    category: 'Collaboration',
    async execute(message, args, client) {
        // Command syntax: collab <club name(s)> <event or division name>
        if (args.length < 2) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}collab <club name(s)> <event or division name>\``);
        }

        // Extract club names and event/division name
        const clubNames = [];
        let eventName = '';
        // Assuming club names are separated by commas and event/division name is enclosed in quotes
        // Example: collab ChessClub, ArtClub "Annual Meetup"

        // Find the index where event/division name starts (assuming it's quoted)
        const eventIndex = args.findIndex(arg => arg.startsWith('"') || arg.startsWith("'"));
        if (eventIndex === -1) {
            return message.reply('Please enclose the event or division name in quotes. Example: `!collab ChessClub, ArtClub "Annual Meetup"`');
        }

        clubNames.push(...args.slice(0, eventIndex).join(' ').split(',').map(name => name.trim()));
        eventName = args.slice(eventIndex).join(' ').replace(/['"]/g, '');

        // Validate club names
        const invalidClubs = clubNames.filter(club => !configHandler.getClubConfig(club));
        if (invalidClubs.length > 0) {
            return message.reply(`The following clubs do not exist: ${invalidClubs.join(', ')}`);
        }

        // Create a temporary collaboration channel
        const collabCategoryId = configHandler.config.collabCategoryId;
        const collabCategory = message.guild.channels.cache.get(collabCategoryId);
        if (!collabCategory || collabCategory.type !== ChannelType.GuildCategory) {
            return message.reply('Collaborations category does not exist or is not a category. Please check your config.');
        }

        try {
            const collabChannel = await message.guild.channels.create({
                name: `collab-${eventName.toLowerCase().replace(/\s+/g, '-')}`,
                type: ChannelType.GuildText,
                parent: collabCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    // Allow specific club roles to view the channel
                    ...clubNames.flatMap(club => {
                        const clubConfig = configHandler.getClubConfig(club);
                        if (!clubConfig) return [];
                        return clubConfig.officerRoles.map(roleName => {
                            const role = message.guild.roles.cache.find(r => r.name === roleName);
                            if (role) {
                                return {
                                    id: role.id,
                                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                                };
                            }
                        }).filter(Boolean);
                    }),
                    // Allow admins to view and manage the channel
                    (() => {
                        const adminRole = message.guild.roles.cache.find(r => r.name === configHandler.getAdminRole());
                        if (adminRole) {
                            return {
                                id: adminRole.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                            };
                        }
                        return null;
                    })(),
                ].filter(Boolean),
            });

            collabChannel.send(`Collaboration Channel for **${eventName}** involving clubs: ${clubNames.join(', ')}.\nDiscuss and plan your event here.\n\nAdmins can use \`${prefix}close\` to archive this channel.`);

            message.reply(`Collaboration channel created: ${collabChannel}`);

            // Schedule channel deletion after 7 days
            const deletionDate = new Date(Date.now() + 604800000); // 7 days from now
            schedule.scheduleJob(deletionDate, async () => {
                try {
                    await collabChannel.delete('Collaboration planning period ended.');
                    const logChannelId = configHandler.getLogChannel(message.guild.id);
                    if (logChannelId) {
                        const logChannel = message.guild.channels.cache.get(logChannelId);
                        if (logChannel) {
                            logChannel.send(`Collaboration channel "${collabChannel.name}" has been deleted after the planning period.`);
                        }
                    }
                } catch (error) {
                    console.error('Error deleting collaboration channel:', error);
                }
            });

        } catch (error) {
            console.error('Error creating collaboration channel:', error);
            message.reply('An error occurred while creating the collaboration channel.');
        }
    },
};
