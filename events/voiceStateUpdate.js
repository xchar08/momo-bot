const { EmbedBuilder } = require('discord.js');
const configHandler = require('../config/configHandler'); // Require configHandler directly

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        // Validate the guild
        if (!newState.guild) return;

        const guild = newState.guild;
        const logChannelId = configHandler.getLogChannel(guild.id);

        // Verify the log channel ID exists
        if (!logChannelId) {
            console.warn(`Log channel not set for guild: ${guild.id}`);
            return;
        }

        // Fetch the log channel
        const logChannel = guild.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.warn(`Log channel with ID ${logChannelId} not found.`);
            return;
        }

        const user = newState.member.user;

        // Resolve the old and new channels properly
        const oldChannel = oldState.channel ? oldState.channel : null;
        const newChannel = newState.channel ? newState.channel : null;

        let embed;

        // User joined a voice channel
        if (!oldChannel && newChannel) {
            embed = new EmbedBuilder()
                .setColor('#00FF00') // Green for join
                .setTitle('User Joined Voice Channel')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Channel', value: `${newChannel.name} (${newChannel.id})`, inline: true }
                )
                .setTimestamp();
        }
        // User left a voice channel
        else if (oldChannel && !newChannel) {
            embed = new EmbedBuilder()
                .setColor('#FF0000') // Red for leave
                .setTitle('User Left Voice Channel')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Channel', value: `${oldChannel.name} (${oldChannel.id})`, inline: true }
                )
                .setTimestamp();
        }
        // User switched voice channels
        else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
            embed = new EmbedBuilder()
                .setColor('#FFFF00') // Yellow for switch
                .setTitle('User Switched Voice Channels')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'From', value: `${oldChannel.name} (${oldChannel.id})`, inline: true },
                    { name: 'To', value: `${newChannel.name} (${newChannel.id})`, inline: true }
                )
                .setTimestamp();
        }

        // Send the embed if an event was detected
        if (embed) {
            try {
                await logChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error sending voiceStateUpdate log:', error);
            }
        }
    },
};
