// commands/admin/unverify.js

module.exports = {
    name: 'unverify',
    description: 'Unverifies a member by removing their club and verification roles and assigning the unverified role.',
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

        // Validate inputs
        if (!memberMention) {
            return message.reply('❌ Please mention the member to unverify.\nUsage: `!unverify @member`');
        }

        try {
            const guild = message.guild;
            const member = memberMention;

            // Get verification and unverified roles
            const verificationRoleId = configHandler.getVerificationRole();
            const unverifiedRoleId = configHandler.getUnverifiedRole();

            if (!verificationRoleId) {
                return message.reply('❌ Verification role is not set. Please contact an administrator.');
            }

            if (!unverifiedRoleId) {
                return message.reply('❌ Unverified role is not set. Please contact an administrator.');
            }

            const verificationRole = guild.roles.cache.get(verificationRoleId);
            const unverifiedRole = guild.roles.cache.get(unverifiedRoleId);

            if (!verificationRole) {
                return message.reply('❌ Verification role does not exist. Please contact an administrator.');
            }

            if (!unverifiedRole) {
                return message.reply('❌ Unverified role does not exist. Please contact an administrator.');
            }

            // Identify the club and position of the member
            let memberClub = null;
            let memberPosition = null;

            const allClubs = configHandler.getAllClubs();
            for (const [clubName, clubData] of Object.entries(allClubs)) {
                for (const [position, userId] of Object.entries(clubData.members)) {
                    if (userId === member.id) {
                        memberClub = clubName;
                        memberPosition = position;
                        break;
                    }
                }
                if (memberClub) break;
            }

            if (!memberClub) {
                return message.reply('❌ This member is not verified in any club.');
            }

            // Remove the member from the club's position
            configHandler.removeMemberFromClub(memberClub, member.id);

            // Remove club role and verification role
            const clubRole = guild.roles.cache.find(role => role.name.toLowerCase() === `club-${memberClub}`);
            if (clubRole && member.roles.cache.has(clubRole.id)) {
                await member.roles.remove(clubRole);
            }

            if (member.roles.cache.has(verificationRole.id)) {
                await member.roles.remove(verificationRole);
            }

            // Assign the unverified role
            await member.roles.add(unverifiedRole);

            message.channel.send(`✅ ${member.user.tag} has been unverified from the "${memberClub}" club and assigned the "${unverifiedRole.name}" role.`);
        } catch (error) {
            console.error(`Error during unverification:`, error);
            message.reply(`❌ An error occurred during unverification: ${error.message}`);
        }
    },
};
