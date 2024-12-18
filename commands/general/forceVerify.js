const ms = require('ms'); // To handle time durations

module.exports = {
    name: 'forceverify',
    description: 'Forcefully verifies a member, allowing clubs to exceed their member limit temporarily.',
    category: 'General',
    async execute(message, args, client) {
        const configHandler = client.configHandler;

        // Check if the user has the verification role
        const verificationRoleId = configHandler.getVerificationRole();
        if (!verificationRoleId) {
            return message.reply('❌ Verification role is not set. Please set it using the `!setverifrole` command.');
        }

        const hasVerifyRole = message.member.roles.cache.has(verificationRoleId);
        if (!hasVerifyRole) {
            return message.reply('❌ You do not have permission to use this command. You need the verification role.');
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

            // Validate duration and enforce a maximum of 24 hours
            const durationMs = ms(duration);
            const maxDurationMs = ms('24h'); // 24 hours in milliseconds
            if (isNaN(durationMs) || durationMs > maxDurationMs) {
                return message.reply('❌ Invalid duration or exceeds the maximum allowed duration of 24 hours. Use formats like `1h`, `12h`, `24h`.');
            }

            // Assign the member to the position in the club, bypassing the member limit
            configHandler.assignMemberToClub(clubName, position, memberMention.id);

            // Assign the club role
            let clubRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === `club-${clubName}`);
            if (!clubRole) {
                clubRole = await message.guild.roles.create({
                    name: `Club-${clubName}`,
                    color: 'Blue',
                    permissions: [],
                });
            }
            await memberMention.roles.add(clubRole);

            // Assign the verification role
            const verificationRole = message.guild.roles.cache.get(verificationRoleId);
            if (!verificationRole) {
                return message.reply('❌ Verification role does not exist. Please contact an administrator.');
            }

            await memberMention.roles.add(verificationRole);

            // Calculate expiration and store in tempVerifications
            const expiration = Date.now() + durationMs;
            client.tempVerifications.push({
                member: memberMention,
                club: clubName,
                position: position,
                expiration: expiration,
            });

            // Schedule automatic removal
            setTimeout(async () => {
                const index = client.tempVerifications.findIndex(v => v.member.id === memberMention.id && v.club === clubName);
                if (index > -1) {
                    client.tempVerifications.splice(index, 1);
                }
                // Remove roles and unverify member
                await memberMention.roles.remove(clubRole);
                await memberMention.roles.remove(verificationRole);
                configHandler.removeMemberFromClub(clubName, memberMention.id);
                message.channel.send(`❌ <@${memberMention.id}> has been automatically unverified from club "${clubName}".`);
            }, durationMs);

            message.channel.send(`✅ <@${memberMention.id}> has been forcefully verified in club "${clubName}" as "${position}" for ${ms(durationMs, { long: true })}. They will be unverified automatically after this duration.`);
        } catch (error) {
            console.error('Error during force verification:', error);
            message.reply(`❌ An error occurred during force verification: ${error.message}`);
        }
    },
};
