// commands/admin/reactionRole.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    description: 'Sets up a reaction role message.',
    category: 'Admin',
    async execute(message, args, client) {
        const configHandler = client.configHandler;

        // Check for admin role
        const adminRoleId = configHandler.getAdminRole();
        if (!adminRoleId || !message.member.roles.cache.has(adminRoleId)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Validate arguments
        if (args.length < 3) {
            return message.reply('❌ Usage: `!reactionrole <#channel> <message content> <emoji:role>`');
        }

        const targetChannel = message.mentions.channels.first();
        if (!targetChannel) {
            return message.reply('❌ Please mention a valid channel.');
        }

        const content = args.slice(1, -1).join(' ');
        const rolesMapping = args[args.length - 1]
            .split(',')
            .map(pair => pair.trim().split(':'))
            .filter(pair => pair.length === 2);

        if (rolesMapping.length === 0) {
            return message.reply('❌ Please provide valid emoji-role mappings (e.g., 👍:Role1,👎:Role2).');
        }

        const embed = new EmbedBuilder()
            .setColor('#0078FF')
            .setTitle('Reaction Roles')
            .setDescription(content)
            .setFooter({ text: 'React to this message to get roles!' })
            .setTimestamp();

        try {
            const reactionMessage = await targetChannel.send({ embeds: [embed] });

            for (const [emoji, roleName] of rolesMapping) {
                const role = message.guild.roles.cache.find(r => r.name === roleName.trim());
                if (!role) {
                    message.reply(`❌ Role "${roleName}" does not exist.`);
                    continue;
                }

                await reactionMessage.react(emoji);

                const collector = reactionMessage.createReactionCollector({
                    filter: (reaction, user) => !user.bot, // Exclude bot reactions
                    dispose: true,
                });

                collector.on('collect', async (reaction, user) => {
                    const member = message.guild.members.cache.get(user.id);
                    if (reaction.emoji.name === emoji && member) {
                        await member.roles.add(role);
                    }
                });

                collector.on('remove', async (reaction, user) => {
                    const member = message.guild.members.cache.get(user.id);
                    if (reaction.emoji.name === emoji && member) {
                        await member.roles.remove(role);
                    }
                });
            }

            message.reply(`✅ Reaction role message set up in ${targetChannel}.`);
        } catch (error) {
            console.error('Error setting up reaction roles:', error);
            message.reply('❌ An error occurred while setting up reaction roles.');
        }
    },
};
