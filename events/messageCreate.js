module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const configHandler = client.configHandler;
        const countingChannels = configHandler.getCountingChannels(message.guild.id);

        if (countingChannels.includes(message.channel.id)) {
            const currentCount = configHandler.getCountingCount(message.channel.id);
            const mode = configHandler.getCountingMode(message.channel.id) || 'normal';
            const userNumber = parseInt(message.content, 10);

            if (isNaN(userNumber)) {
                return message.delete().catch(() => {});
            }

            // Determine the expected number based on the mode
            let expectedNumber;
            switch (mode) {
                case 'count2':
                    expectedNumber = currentCount;
                    break;
                case 'count3':
                    expectedNumber = currentCount;
                    break;
                case 'count4':
                    expectedNumber = currentCount;
                    break;
                case 'count5':
                    expectedNumber = currentCount;
                    break;
                case 'countdown':
                    expectedNumber = currentCount;
                    break;
                default: // Normal or hex/binary
                    expectedNumber = currentCount;
                    break;
            }

            if (userNumber === expectedNumber) {
                message.react('✅');

                // Check for milestone and celebrate
                const milestoneStep = 100; // Customize milestone frequency
                if (userNumber % milestoneStep === 0) {
                    message.channel.send(`🎉 **Milestone Reached!** ${userNumber} 🎉`);
                }

                // Update the count based on the mode
                switch (mode) {
                    case 'count2':
                        configHandler.setCountingCount(message.channel.id, currentCount + 2);
                        break;
                    case 'count3':
                        configHandler.setCountingCount(message.channel.id, currentCount + 3);
                        break;
                    case 'count4':
                        configHandler.setCountingCount(message.channel.id, currentCount + 4);
                        break;
                    case 'count5':
                        configHandler.setCountingCount(message.channel.id, currentCount + 5);
                        break;
                    case 'countdown':
                        configHandler.setCountingCount(message.channel.id, currentCount - 1);
                        break;
                    default: // Normal
                        configHandler.setCountingCount(message.channel.id, currentCount + 1);
                        break;
                }
            } else {
                message.react('❌');

                // Notify and reset the count
                const resetValue = mode === 'countdown' ? 1000 : 1;
                message.reply(`❌ Incorrect number. The count has been reset to ${resetValue}.`).then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                });

                configHandler.setCountingCount(message.channel.id, resetValue);

                message.delete().catch(() => {});
            }
        }

        // Command execution logic
        const prefix = configHandler.getPrefix(message.guild.id) || '!';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('❌ There was an error trying to execute that command!');
        }
    },
};
