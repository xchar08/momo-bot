// guildMemberUpdate.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const configHandler = require('../config/configHandler');
        const logChannelId = configHandler.getLogChannel(newMember.guild.id);
        if (!logChannelId) return;

        const logChannel = newMember.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (addedRoles.size === 0 && removedRoles.size === 0) return; // No role changes

        const embed = new MessageEmbed()
            .setColor('#0000FF')
            .setTitle('Member Roles Updated')
            .addFields(
                {
                    name: 'Member',
                    value: `${newMember.user.tag} (${newMember.id})`,
                    inline: true
                }
            )
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        if (addedRoles.size > 0) {
            embed.addField('Roles Added', addedRoles.map(r => r.name).join(', '), false);
        }

        if (removedRoles.size > 0) {
            embed.addField('Roles Removed', removedRoles.map(r => r.name).join(', '), false);
        }

        logChannel.send({ embeds: [embed] });
    },
};
