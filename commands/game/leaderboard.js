const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Displays the top contributors for caring for the mini Momo.',
    category: 'Game',
    async execute(message, args, client) {
        const momo = client.miniMomos;

        const leaderboard = Object.entries(momo.contributors)
            .map(([userId, contributions]) => ({
                userId,
                total: contributions.feed + contributions.play,
                feed: contributions.feed,
                play: contributions.play,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        const description = leaderboard.length
            ? leaderboard
                  .map((entry, index) => `**${index + 1}. <@${entry.userId}>** - Total: ${entry.total}, 🍎 Feed: ${entry.feed}, 🎾 Play: ${entry.play}`)
                  .join('\n')
            : 'No contributions yet!';

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Mini Momo Care Leaderboard')
            .setDescription(description)
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
