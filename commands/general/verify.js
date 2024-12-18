// verify.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'verify',
    description: 'Verifies a user and assigns roles based on their selected club.',
    category: 'General',
    async execute(message, args, client) {
        const guildId = message.guild.id;
        const prefix = configHandler.getPrefix(guildId);

        // Check if verificationRole is set
        const verificationRoleName = configHandler.getVerificationRole();
        if (!verificationRoleName) {
            return message.reply('Verification role is not set. Please contact an administrator.');
        }

        // Check if the user provided a club name
        if (args.length === 0) {
            return message.reply(`Please specify a club to verify for. Usage: \`${prefix}verify <club name>\``);
        }

        const clubName = args[0];
        const clubConfig = configHandler.getClubConfig(clubName);

        if (!clubConfig) {
            return message.reply(`Club "${clubName}" does not exist.`);
        }

        const officerRoleName = clubConfig.officerRole;
        const additionalRoles = clubConfig.additionalRoles;

        // Fetch the roles
        const verificationRole = message.guild.roles.cache.find(r => r.name === verificationRoleName);
        if (!verificationRole) {
            return message.reply(`Verification role "${verificationRoleName}" does not exist. Please contact an administrator.`);
        }

        const officerRole = message.guild.roles.cache.find(r => r.name === officerRoleName);
        if (!officerRole) {
            return message.reply(`Officer role "${officerRoleName}" does not exist. Please contact an administrator.`);
        }

        const rolesToAssign = [verificationRole, officerRole];

        // Assign additional roles
        additionalRoles.forEach(roleName => {
            const role = message.guild.roles.cache.find(r => r.name === roleName);
            if (role) {
                rolesToAssign.push(role);
            }
        });

        // Check if the user already has all roles
        const hasRoles = rolesToAssign.every(role => message.member.roles.cache.has(role.id));
        if (hasRoles) {
            return message.reply(`You are already verified for "${clubName}".`);
        }

        // Assign roles to the user
        try {
            await message.member.roles.add(rolesToAssign);
            message.reply(`✅ You have been verified for "${clubName}" and have been assigned the appropriate roles.`);
        } catch (error) {
            console.error('Error assigning roles:', error);
            message.reply('❌ There was an error assigning your roles. Please contact an administrator.');
        }
    },
};
