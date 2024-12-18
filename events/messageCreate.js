module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const configHandler = client.configHandler;
        const countingChannels = configHandler.getCountingChannels(message.guild.id);

        if (countingChannels.includes(message.channel.id)) {
            const currentCount = configHandler.getCountingCount(message.channel.id);
            const mode = configHandler.getCountingMode(message.channel.id) || 'normal';
            let userInput = message.content.trim();

            let userNumber;
            let expectedNumber;

            // Parse user input based on mode
            try {
                switch (mode) {
                    case 'binary':
                        userNumber = parseInt(userInput, 2); // Parse binary input
                        expectedNumber = currentCount;
                        break;
                    case 'hex':
                        userNumber = parseInt(userInput, 16); // Parse hexadecimal input
                        expectedNumber = currentCount;
                        break;
                    case 'count2':
                    case 'count3':
                    case 'count4':
                    case 'count5':
                    case 'countdown':
                        userNumber = parseInt(userInput, 10); // Decimal input
                        expectedNumber = currentCount;
                        break;
                    default: // Normal
                        userNumber = parseInt(userInput, 10); // Decimal input
                        expectedNumber = currentCount;
                        break;
                }
            } catch (error) {
                message.react('❌');
                return; // If parsing fails, exit early
            }

            // Check if input is invalid
            if (isNaN(userNumber)) {
                message.react('❌');
                return; // Exit early if it's not a valid number
            }

            // Validate the user's input
            if (userNumber === expectedNumber) {
                message.react('✅');

                // Milestone Check
                const milestoneStep = 100;
                if (userNumber % milestoneStep === 0) {
                    message.channel.send(`🎉 **Milestone Reached!** ${userInput} 🎉`);
                }

                // Update the count
                switch (mode) {
                    case 'binary':
                    case 'hex':
                    case 'normal':
                        configHandler.setCountingCount(message.channel.id, currentCount + 1);
                        break;
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
                }
            } else {
                message.react('❌');

                // Notify and reset
                const resetValue = mode === 'countdown' ? 1000 : 1;
                message.reply(`❌ Incorrect input. The count has been reset to ${resetValue}.`).then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                });

                configHandler.setCountingCount(message.channel.id, resetValue);
            }
        }

        // Command Execution Logic
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
