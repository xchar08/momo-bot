const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'momogame',
    description: 'Displays the mini Momo game commands.',
    category: 'Game',
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🎮 Mini Momo Game')
            .setDescription(
                'Take care of the mini Momo! Keep it fed, happy, and healthy.\n' +
                'Commands:\n' +
                '`!feed` - Feed the mini Momo to reduce hunger.\n' +
                '`!play` - Play with the mini Momo to increase happiness.\n' +
                '`!status` - Check the current stats of the mini Momo.\n' +
                '`!leaderboard` - See the top contributors.\n' +
                '`!revive` - Revive the mini Momo if it has died.'
            )
            .setFooter({ text: 'momo-bot by xchar08' })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
