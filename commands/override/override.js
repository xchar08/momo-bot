// override.js
const configHandler = require('../../config/configHandler');
const schedule = require('node-schedule');

module.exports = {
    name: 'override',
    description: 'Overrides officer limits by temporarily assigning roles.',
    category: 'Override',
    async execute(message, args, client) {
        // Command syntax: override <club name> @member <club role> <IRL name>
        if (args.length < 3) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}override <club name> @member <club role> <IRL name>\``);
        }

        const clubName = args[0];
        const memberMention = args[1];
        const clubRoleName = args[2];
        const irlName = args.slice(3).join(' ');

        if (!irlName) {
            return message.reply(`Usage: \`${configHandler.getPrefix(message.guild.id)}override <club name> @member <club role> <IRL name>\``);
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

        // Fetch the club role
        const clubRole = message.guild.roles.cache.find(r => r.name === clubRoleName);
        if (!clubRole) {
            return message.reply(`Role "${clubRoleName}" does not exist.`);
        }

        // Check if the role is one of the officer roles
        const isOfficerRole = clubConfig.officerRoles.includes(clubRoleName);

        if (isOfficerRole) {
            // Count current officers in the club for the specific role
            const currentOfficers = message.guild.members.cache.filter(m => {
                return m.roles.cache.has(clubRole.id);
            }).size;

            if (currentOfficers < clubConfig.maxOfficers) {
                return message.reply(`There are still available officer slots in "${clubName}". No need to override.`);
            }

            // Proceed with override
            const verificationRoleName = configHandler.getVerificationRole();
            if (!verificationRoleName) {
                return message.reply('Verification role is not set. Please set it using the `setverifrole` command.');
            }

            const verificationRole = message.guild.roles.cache.find(r => r.name === verificationRoleName);
            if (!verificationRole) {
                return message.reply(`Verification role "${verificationRoleName}" does not exist.`);
            }

            try {
                await member.roles.add(verificationRole);
                await member.roles.add(clubRole);

                // Update nickname
                const newNickname = `${irlName}`;
                await member.setNickname(newNickname);

                message.reply(`${member.user.tag} has been temporarily verified as "${clubRoleName}" in "${clubName}" for 1 day.`);

                // Schedule role removal after 1 day
                const removalDate = new Date(Date.now() + 86400000); // 1 day from now
                schedule.scheduleJob(removalDate, async () => {
                    try {
                        await member.roles.remove(clubRole);
                        // Optionally, remove the verification role or keep it
                        await member.setNickname(null); // Resets to default nickname
                        const logChannelId = configHandler.getLogChannel(message.guild.id);
                        if (logChannelId) {
                            const logChannel = message.guild.channels.cache.get(logChannelId);
                            if (logChannel) {
                                logChannel.send(`${member.user.tag}'s temporary role "${clubRoleName}" has been removed.`);
                            }
                        }
                    } catch (error) {
                        console.error('Error removing temporary role:', error);
                    }
                });

            } catch (error) {
                console.error('Error assigning temporary role:', error);
                message.reply('An error occurred while assigning the temporary role.');
            }
        } else {
            // Non-officer roles can be verified normally
            const verificationRoleName = configHandler.getVerificationRole();
            if (!verificationRoleName) {
                return message.reply('Verification role is not set. Please set it using the `setverifrole` command.');
            }

            const verificationRole = message.guild.roles.cache.find(r => r.name === verificationRoleName);
            if (!verificationRole) {
                return message.reply(`Verification role "${verificationRoleName}" does not exist.`);
            }

            try {
                await member.roles.add(verificationRole);
                await member.roles.add(clubRole);

                // Update nickname
                const newNickname = `${irlName}`;
                await member.setNickname(newNickname);

                message.reply(`${member.user.tag} has been verified as "${clubRoleName}" in "${clubName}".`);
            } catch (error) {
                console.error('Error verifying member:', error);
                message.reply('An error occurred while verifying the member.');
            }
        }
    },
};
