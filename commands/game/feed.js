const { decayStats, trackContribution, checkMilestone } = require('../../utils/momoGameUtils');

module.exports = {
    name: 'feed',
    description: 'Feeds the mini Momo to reduce hunger.',
    category: 'Game',
    async execute(message, args, client) {
        const momo = client.miniMomos;
        decayStats(momo);

        if (momo.health <= 0) {
            return message.reply('☠️ The mini Momo is dead. Use `!revive` to bring it back to life.');
        }

        momo.hunger = Math.min(momo.hunger + 20, 100);
        trackContribution(momo, message.author.id, 'feed');
        message.reply('🍎 You fed the mini Momo! Hunger increased.');

        checkMilestone(momo, message);
    },
};
