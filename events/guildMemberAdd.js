module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(member.guild.id);
        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = {
            color: '#00FF00',
            title: 'New Member Joined',
            fields: [
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
            ],
            timestamp: new Date(),
        };

        logChannel.send({ embeds: [embed] });
    },
};
