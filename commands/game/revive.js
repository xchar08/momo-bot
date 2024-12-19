module.exports = {
    name: 'revive',
    description: 'Revives the mini Momo if it has died.',
    category: 'Game',
    async execute(message, args, client) {
        const momo = client.miniMomos;

        if (momo.health > 0) {
            return message.reply('The mini Momo is alive and well!');
        }

        momo.hunger = 50;
        momo.happiness = 50;
        momo.health = 50;
        momo.lastInteraction = Date.now();

        message.reply('💖 The mini Momo has been revived! Take good care of it!');
    },
};
