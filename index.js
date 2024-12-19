// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const configHandler = require('./config/configHandler'); // Import the config handler

// Initialize the Discord client with appropriate intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Guild-related events
        GatewayIntentBits.GuildMessages, // Message-related events
        GatewayIntentBits.GuildVoiceStates, // Required for voiceStateUpdate
        GatewayIntentBits.MessageContent, // To read message content
        GatewayIntentBits.GuildMembers, // Member-related events
        GatewayIntentBits.GuildMessageReactions, // Reaction-related events
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Initialize temporary verification storage
client.tempVerifications = [];

// Initialize a Collection to store commands
client.commands = new Collection();

// Initialize in-memory counting storage
client.counting = new Map();

// Initialize Mini Momo game state
client.miniMomos = {
    hunger: 100,
    happiness: 100,
    health: 100,
    lastInteraction: Date.now(),
    contributors: {},
};

// Define the path to the commands directory
const commandsPath = path.join(__dirname, 'commands');

// Read all subdirectories (categories) in the commands directory
fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);

    // Ensure the folder is a directory
    if (!fs.lstatSync(folderPath).isDirectory()) return;

    // Read and load all JavaScript files in the directory
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);

        try {
            const command = require(filePath);
            // Ensure the command has a name and an execute function
            if (command.name && command.execute) {
                client.commands.set(command.name, command);
                console.log(`Loaded command: ${command.name}`);
            } else {
                console.warn(`[WARNING] Missing "name" or "execute" property in ${filePath}.`);
            }
        } catch (error) {
            console.error(`Error loading command at ${filePath}:`, error);
        }
    }
});

// Define the path to the events directory
const eventsPath = path.join(__dirname, 'events');

// Read and load all JavaScript files in the events directory
fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')).forEach(file => {
    const filePath = path.join(eventsPath, file);
    try {
        const event = require(filePath);
        if (event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`Registered event: ${event.name}`);
        } else {
            console.warn(`[WARNING] Event at ${filePath} is missing a "name" property.`);
        }
    } catch (error) {
        console.error(`Error loading event at ${filePath}:`, error);
    }
});

// Attach the configuration handler to the client for easy access
client.configHandler = configHandler;

// Log in to Discord
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log(`Logged in as ${client.user.tag}!`))
    .catch(error => console.error('Failed to log in:', error));

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});
