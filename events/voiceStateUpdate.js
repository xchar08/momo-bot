module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(newState.guild.id);
        if (!logChannelId) return;

        const logChannel = newState.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        if (oldState.channelId !== newState.channelId) {
            const user = newState.member.user;
            const embed = {
                color: oldState.channelId ? '#FF0000' : '#00FF00',
                title: oldState.channelId ? 'User Left Voice Channel' : 'User Joined Voice Channel',
                fields: [
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Channel', value: `${newState.channel || oldState.channel}`, inline: true },
                ],
                timestamp: new Date(),
            };

            logChannel.send({ embeds: [embed] });
        }
    },
};
