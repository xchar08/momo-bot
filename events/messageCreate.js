module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const configHandler = client.configHandler;
        const countingChannels = configHandler.getCountingChannels(message.guild.id);

        if (countingChannels.includes(message.channel.id)) {
            const currentCount = configHandler.getCountingCount(message.channel.id);
            const mode = configHandler.getCountingMode(message.channel.id) || 'normal';
            
            // Parse user input as a number
            const userNumber = parseInt(message.content, 10);

            // Check if the message content is not a number
            if (isNaN(userNumber)) {
                message.react('❌');
                return; // Exit early if it's not a valid number
            }

            // Determine the expected number based on the mode
            let expectedNumber;
            switch (mode) {
                case 'count2':
                case 'count3':
                case 'count4':
                case 'count5':
                case 'countdown':
                    expectedNumber = currentCount;
                    break;
                default: // Normal or other unsupported modes
                    expectedNumber = currentCount;
                    break;
            }

            // Validate the user's input
            if (userNumber === expectedNumber) {
                message.react('✅');

                // Check for milestone
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
