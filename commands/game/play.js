const { decayStats, trackContribution, checkMilestone } = require('../../utils/momoGameUtils');

module.exports = {
    name: 'play',
    description: 'Plays with the mini Momo to increase happiness.',
    category: 'Game',
    async execute(message, args, client) {
        const momo = client.miniMomos;
        decayStats(momo);

        if (momo.health <= 0) {
            return message.reply('☠️ The mini Momo is dead. Use `!revive` to bring it back to life.');
        }

        momo.happiness = Math.min(momo.happiness + 20, 100);
        trackContribution(momo, message.author.id, 'play');
        message.reply('🎾 You played with the mini Momo! Happiness increased.');

        checkMilestone(momo, message);
    },
};
