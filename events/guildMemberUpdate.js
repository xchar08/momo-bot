// events/guildMemberUpdate.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        if (newMember.user.bot) return; // Exclude bots

        const configHandler = client.configHandler;
        const logChannelId = configHandler.getLogChannel(newMember.guild.id);
        if (!logChannelId) return;

        const logChannel = newMember.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (addedRoles.size === 0 && removedRoles.size === 0) return;

        const embed = new EmbedBuilder()
            .setColor('#0000FF')
            .setTitle('Member Roles Updated')
            .addFields(
                { name: 'Member', value: `${newMember.user.tag} (${newMember.id})`, inline: true }
            )
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        if (addedRoles.size > 0) {
            embed.addFields({ name: 'Roles Added', value: addedRoles.map(r => r.name).join(', '), inline: false });
        }

        if (removedRoles.size > 0) {
            embed.addFields({ name: 'Roles Removed', value: removedRoles.map(r => r.name).join(', '), inline: false });
        }

        logChannel.send({ embeds: [embed] });
    },
};
