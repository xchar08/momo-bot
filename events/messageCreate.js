// messageCreate.js
const { EmbedBuilder } = require('discord.js');
const configHandler = require('../config/configHandler');

// In-memory storage for counting state
const countingState = {}; // Format: { channelId: currentNumber }

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore messages from bots or without guild
        if (!message.guild || message.author.bot) return;

        const configHandler = require('../config/configHandler');
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
            const content = message.content.trim();

            // Parse the message content to a number
            const number = parseInt(content, 10);
            if (isNaN(number)) {
                // If not a number, respond with ❌ and reset the count
                await message.react('❌');
                countingState[message.channel.id] = 1;
                return;
            }

            // Get the current expected number
            const expectedNumber = countingState[message.channel.id] || 1;

            if (number === expectedNumber) {
                // Correct number
                await message.react('✅');
                countingState[message.channel.id] = expectedNumber + 1;
            } else {
                // Incorrect number
                await message.react('❌');
                countingState[message.channel.id] = 1;
            }
        }

        // **Additional Event Handling Below (if any)**
        // ... (existing message handling code)
    },
};
