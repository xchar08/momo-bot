// guildMemberRemove.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(member.guild.id);
        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new MessageEmbed()
            .setColor('#FFA500')
            .setTitle('Member Left')
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    },
};
