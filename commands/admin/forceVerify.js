// commands/admin/forceVerify.js

const ms = require('ms'); // To handle time durations

module.exports = {
    name: 'forceverify',
    description: 'Forcefully verifies a member, allowing clubs to exceed their member limit temporarily.',
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
        const memberMention = message.mentions.members.first();
        const clubName = args[1]?.toLowerCase();
        const position = args[2]?.toLowerCase();
        const irlName = args[3];
        const duration = args[4] || '24h'; // Default to 24 hours

        // Validate inputs
        if (!memberMention) {
            return message.reply('❌ Please mention the member to force verify.\nUsage: `!forceverify @member <club> <position> <IRL name> [duration]`');
        }

        if (!clubName || !position || !irlName) {
            return message.reply('❌ Missing arguments.\nUsage: `!forceverify @member <club> <position> <IRL name> [duration]`');
        }

        try {
            // Check if the club exists
            const clubMembers = configHandler.getClubMembers(clubName);
            if (!clubMembers) {
                return message.reply(`❌ Club "${clubName}" does not exist. Please create it using the \`!addclub\` command.`);
            }

            // Assign the member to the position in the club, bypassing the member limit
            configHandler.assignMemberToClub(clubName, position, memberMention.id);

            // Assign the club role
            let clubRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === `club-${clubName}`);
            if (!clubRole) {
                // If the club role doesn't exist, create it
                clubRole = await message.guild.roles.create({
                    name: `Club-${clubName}`,
                    color: 'Blue', // Customize as needed
                    permissions: [] // Define necessary permissions if needed
                });
            }
            await memberMention.roles.add(clubRole);

            // Assign the verification role
            const verificationRoleId = configHandler.getVerificationRole();
            if (!verificationRoleId) {
                return message.reply('❌ Verification role is not set. Please set it using the `!setverifrole` command.');
            }

            const verificationRole = message.guild.roles.cache.get(verificationRoleId);
            if (!verificationRole) {
                return message.reply('❌ Verification role does not exist. Please contact an administrator.');
            }

            await memberMention.roles.add(verificationRole);

            // Schedule role removal after the duration
            const durationMs = ms(duration);
            if (isNaN(durationMs)) {
                return message.reply('❌ Invalid duration format. Please use formats like `1d`, `12h`, `30m`.');
            }

            setTimeout(async () => {
                try {
                    // Remove club role and verification role
                    if (clubRole && memberMention.roles.cache.has(clubRole.id)) {
                        await memberMention.roles.remove(clubRole);
                    }

                    if (verificationRole && memberMention.roles.cache.has(verificationRole.id)) {
                        await memberMention.roles.remove(verificationRole);
                    }

                    // Remove member from club
                    configHandler.removeMemberFromClub(clubName, memberMention.id);

                    // Assign unverified role
                    const unverifiedRoleId = configHandler.getUnverifiedRole();
                    if (unverifiedRoleId) {
                        const unverifiedRole = message.guild.roles.cache.get(unverifiedRoleId);
                        if (unverifiedRole && !memberMention.roles.cache.has(unverifiedRole.id)) {
                            await memberMention.roles.add(unverifiedRole);
                        }
                    }

                    message.channel.send(`🔄 ${memberMention.user.tag} has been automatically unverified after the override duration.`);
                } catch (err) {
                    console.error(`Error during automatic unverification:`, err);
                }
            }, durationMs);

            message.channel.send(`✅ <@${memberMention.id}> has been forcefully verified in club "${clubName}" as "${position}" for ${ms(durationMs, { long: true })}. They will be unverified automatically after this duration.`);
        } catch (error) {
            console.error(`Error during force verification:`, error);
            message.reply(`❌ An error occurred during force verification: ${error.message}`);
        }
    },
};
