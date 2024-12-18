// unverify.js
const configHandler = require('../../config/configHandler');

module.exports = {
    name: 'unverify',
    description: 'Removes your verification and associated club roles.',
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
            return message.reply(`Please specify a club to unverify from. Usage: \`${prefix}unverify <club name>\``);
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

        const rolesToRemove = [verificationRole, officerRole];

        // Remove additional roles
        additionalRoles.forEach(roleName => {
            const role = message.guild.roles.cache.find(r => r.name === roleName);
            if (role) {
                rolesToRemove.push(role);
            }
        });

        // Check if the user has any of the roles
        const hasAnyRole = rolesToRemove.some(role => message.member.roles.cache.has(role.id));
        if (!hasAnyRole) {
            return message.reply(`You do not have any roles for "${clubName}".`);
        }

        // Remove roles from the user
        try {
            await message.member.roles.remove(rolesToRemove);
            message.reply(`✅ Your roles for "${clubName}" have been removed.`);
        } catch (error) {
            console.error('Error removing roles:', error);
            message.reply('❌ There was an error removing your roles. Please contact an administrator.');
        }
    },
};
