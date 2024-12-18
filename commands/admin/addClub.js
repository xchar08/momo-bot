// commands/admin/addClub.js

const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'addclub',
    description: 'Adds a new club to the configuration and creates its category with default channels.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = client.configHandler;

        // Check if the user has the admin role
        const adminRoleId = configHandler.getAdminRole();
        if (adminRoleId) {
            if (!message.member.roles.cache.has(adminRoleId)) {
                return message.reply('❌ You do not have permission to use this command.');
            }
        } else {
            return message.reply('❌ Admin role is not set. Please set it using the `!setadminrole` command.');
        }

        // Parse arguments
        const clubName = args[0]?.toLowerCase();

        // Validate input
        if (!clubName) {
            return message.reply(`❌ Please provide a club name.\nUsage: \`${configHandler.getPrefix(message.guild.id)}addclub <clubName>\``);
        }

        try {
            // Add the club to the configuration
            configHandler.addClub(clubName);

            // Fetch the verification role
            const verificationRoleId = configHandler.getVerificationRole();
            if (!verificationRoleId) {
                return message.reply('❌ Verification role is not set. Please set it using the `!setverifrole` command.');
            }
            const verificationRole = message.guild.roles.cache.get(verificationRoleId);
            if (!verificationRole) {
                return message.reply('❌ Verification role does not exist. Please contact an administrator.');
            }

            // Create the club category
            const clubCategory = await message.guild.channels.create({
                name: clubName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel], // Prevent everyone from viewing by default
                    },
                    {
                        id: verificationRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], // Allow verified users
                    },
                ],
            });

            // Create default text channels
            const textChannels = ['chat', 'events', 'ideas', 'resources', 'roster'];
            for (const channelName of textChannels) {
                await message.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: clubCategory.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: verificationRole.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });
            }

            // Create the voice channel
            await message.guild.channels.create({
                name: 'meetings',
                type: ChannelType.GuildVoice,
                parent: clubCategory.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: verificationRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
                    },
                ],
            });

            message.channel.send(`✅ Club "${clubName}" has been successfully created with its category and default channels.`);
        } catch (error) {
            console.error(`Error creating club "${clubName}":`, error);
            message.reply(`❌ Error creating club "${clubName}": ${error.message}`);
        }
    },
};
