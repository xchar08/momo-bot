module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(member.guild.id);
        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = {
            color: '#FF0000', // Red color for removal
            title: 'Member Left',
            fields: [
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
            ],
            thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
            timestamp: new Date(),
        };

        logChannel.send({ embeds: [embed] });
    },
};
