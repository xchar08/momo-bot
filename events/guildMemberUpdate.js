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

        // Get the roles before and after the update
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // Identify added and removed roles
        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        // Debugging: Log the role IDs for validation
        console.log('Old Roles:', oldRoles.map(r => r.id));
        console.log('New Roles:', newRoles.map(r => r.id));
        console.log('Added Roles:', addedRoles.map(r => r.id));
        console.log('Removed Roles:', removedRoles.map(r => r.id));

        // If no roles were added or removed, exit early
        if (addedRoles.size === 0 && removedRoles.size === 0) return;

        // Create the embed for logging
        const embed = new EmbedBuilder()
            .setColor('#0000FF') // Blue for role updates
            .setTitle('Member Roles Updated')
            .addFields(
                { name: 'Member', value: `${newMember.user.tag} (${newMember.id})`, inline: true }
            )
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Add fields for added roles
        if (addedRoles.size > 0) {
            embed.addFields({ name: 'Roles Added', value: addedRoles.map(r => r.name).join(', '), inline: false });
        }

        // Add fields for removed roles
        if (removedRoles.size > 0) {
            embed.addFields({ name: 'Roles Removed', value: removedRoles.map(r => r.name).join(', '), inline: false });
        }

        // Send the embed to the log channel
        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending role update log:', error);
        }
    },
};
