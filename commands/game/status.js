const { decayStats } = require('../../utils/momoGameUtils');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'status',
    description: 'Displays the current stats of the mini Momo.',
    category: 'Game',
    async execute(message, args, client) {
        const momo = client.miniMomos;
        decayStats(momo);

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Mini Momo Status')
            .addFields(
                { name: 'Hunger', value: `${momo.hunger}/100`, inline: true },
                { name: 'Happiness', value: `${momo.happiness}/100`, inline: true },
                { name: 'Health', value: `${momo.health}/100`, inline: true }
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
