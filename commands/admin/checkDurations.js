const { EmbedBuilder } = require('discord.js');
const ms = require('ms'); // Import the ms module

module.exports = {
    name: 'checkdurations',
    description: 'Lists all current temporary verifications and their remaining durations.',
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

        // Check if there are active temporary verifications
        const tempVerifications = client.tempVerifications || [];
        if (tempVerifications.length === 0) {
            return message.reply('✅ No active temporary verifications.');
        }

        // Build an embed with all temporary verifications
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('📋 Temporary Verifications')
            .setDescription('Here are all the members with temporary verifications:');

        tempVerifications.forEach(tempVerif => {
            const remainingTime = tempVerif.expiration - Date.now();
            const remainingFormatted = remainingTime > 0
                ? ms(remainingTime, { long: true })
                : 'Expired';

            embed.addFields([
                {
                    name: `Member: ${tempVerif.member.user.tag}`,
                    value: `**Club**: ${tempVerif.club}\n**Position**: ${tempVerif.position}\n**Time Left**: ${remainingFormatted}`,
                    inline: false,
                },
            ]);
        });

        await message.channel.send({ embeds: [embed] });
    },
};
