// messageCreate.js
const { EmbedBuilder } = require('discord.js');
const configHandler = require('../config/configHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore messages from bots or without guild
        if (!message.guild || message.author.bot) return;

        const prefix = configHandler.getPrefix(message.guild.id);

        // **Handle Command Execution**
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);

            if (command) {
                try {
                    await command.execute(message, args, client);
                } catch (error) {
                    console.error(`Error executing command ${commandName}:`, error);
                    message.reply('There was an error executing that command.');
                }
                return; // Exit after handling command
            }
        }

        // **Handle Counting Game**
        const countingChannels = configHandler.getCountingChannels(message.guild.id);
        if (countingChannels.includes(message.channel.id)) {
            const mode = configHandler.getCountingMode(message.channel.id);
            let expectedNumber = configHandler.getCountingCount(message.channel.id);
            const content = message.content.trim();

            let userNumber;
            let isValid = false;

            switch (mode) {
                case 'normal':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'hex':
                    // Parse as hexadecimal
                    userNumber = parseInt(content, 16);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'binary':
                    // Parse as binary
                    userNumber = parseInt(content, 2);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'count2':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'count3':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'count4':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'count5':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                case 'countdown':
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
                default:
                    // Default to normal counting
                    userNumber = parseInt(content, 10);
                    isValid = !isNaN(userNumber) && userNumber === expectedNumber;
                    break;
            }

            if (isValid) {
                // Correct count
                await message.react('✅');

                // Update the count based on mode
                switch (mode) {
                    case 'normal':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 1);
                        break;
                    case 'hex':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 1);
                        break;
                    case 'binary':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 1);
                        break;
                    case 'count2':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 2);
                        break;
                    case 'count3':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 3);
                        break;
                    case 'count4':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 4);
                        break;
                    case 'count5':
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 5);
                        break;
                    case 'countdown':
                        configHandler.setCountingCount(message.channel.id, expectedNumber - 1);
                        break;
                    default:
                        configHandler.setCountingCount(message.channel.id, expectedNumber + 1);
                        break;
                }
            } else {
                // Incorrect count
                await message.react('❌');
                // Reset the count
                configHandler.resetCountingCount(message.channel.id);
            }
        }

        // **Additional Event Handling Below (if any)**
        // ... (existing message handling code)
    },
};
