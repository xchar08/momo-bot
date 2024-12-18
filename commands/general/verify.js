module.exports = {
    name: 'verify',
    description: 'Verifies a member by assigning them a club and position.',
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

        // Validate inputs
        if (!memberMention) {
            return message.reply('❌ Please mention the member to verify.\nUsage: `!verify @member <club> <position> <IRL name>`');
        }

        if (!clubName || !position || !irlName) {
            return message.reply('❌ Missing arguments.\nUsage: `!verify @member <club> <position> <IRL name>`');
        }

        try {
            // Check if the club exists
            const clubMembers = configHandler.getClubMembers(clubName);
            if (!clubMembers) {
                return message.reply(`❌ Club "${clubName}" does not exist. Please create it using the \`!addclub\` command.`);
            }

            // Check if the club has reached its maximum members
            const totalMembers = Object.keys(clubMembers).length;
            if (totalMembers >= configHandler.getAllClubs()[clubName].maxMembers) {
                return message.reply(`❌ Club "${clubName}" has reached its maximum of ${configHandler.getAllClubs()[clubName].maxMembers} members. Please unverify someone before adding a new member.`);
            }

            // Check if the position is already occupied
            if (clubMembers[position]) {
                return message.reply(`❌ The position "${position}" in club "${clubName}" is already occupied by <@${clubMembers[position]}>.`);
            }

            // Assign the member to the position in the club
            configHandler.assignMemberToClub(clubName, position, memberMention.id);

            // Assign the club role
            let clubRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === `club-${clubName}`);
            if (!clubRole) {
                // If the club role doesn't exist, create it
                clubRole = await message.guild.roles.create({
                    name: `Club-${clubName}`,
                    color: 'Blue', // Customize as needed
                    permissions: []
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

            // Remove the unverified role
            const unverifiedRoleId = configHandler.getUnverifiedRole();
            if (unverifiedRoleId) {
                const unverifiedRole = message.guild.roles.cache.get(unverifiedRoleId);
                if (unverifiedRole && memberMention.roles.cache.has(unverifiedRole.id)) {
                    await memberMention.roles.remove(unverifiedRole);
                }
            }

            message.channel.send(`✅ <@${memberMention.id}> has been verified and assigned to the "${clubName}" club in the "${position}" position. IRL Name: ${irlName}`);
        } catch (error) {
            console.error(`Error during verification:`, error);
            message.reply(`❌ An error occurred during verification: ${error.message}`);
        }
    },
};
