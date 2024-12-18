// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const configHandler = require('./config/configHandler'); // Import the config handler

// Initialize the Discord client with appropriate intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // For guild-related events
        GatewayIntentBits.GuildMessages, // For message-related events
        GatewayIntentBits.MessageContent, // To read message content (requires enabling in Developer Portal)
        GatewayIntentBits.GuildMembers, // For member-related events
        GatewayIntentBits.GuildMessageReactions, // For reaction-related events
        // Add other intents as needed
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Initialize a Collection (map) to store commands
client.commands = new Collection();

// Define the path to the commands directory
const commandsPath = path.join(__dirname, 'commands');

// Read all subdirectories (categories) in the commands directory
const commandFolders = fs.readdirSync(commandsPath);

// Loop through each command category folder
for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    // Ensure the path is a directory
    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    // Read all JavaScript files in the current command category
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    // Loop through each command file
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);

        try {
            const command = require(filePath);

            // Ensure the command has a name and an execute function
            if ('name' in command && 'execute' in command) {
                client.commands.set(command.name, command);
                console.log(`Loaded command: ${command.name}`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
            }
        } catch (error) {
            console.error(`Error loading command at ${filePath}:`, error);
        }
    }
}

// Define the path to the events directory
const eventsPath = path.join(__dirname, 'events');

// Read all JavaScript files in the events directory
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Loop through each event file
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    // Check if the event exports an array (multiple events in one file)
    if (Array.isArray(event)) {
        event.forEach(evt => {
            if (evt.once) {
                client.once(evt.name, (...args) => evt.execute(...args, client));
            } else {
                client.on(evt.name, (...args) => evt.execute(...args, client));
            }
            console.log(`Registered event: ${evt.name}`);
        });
    } else {
        // Single event export
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`Registered event: ${event.name}`);
    }
}

// Attach the configuration handler to the client for easy access in events and commands
client.configHandler = configHandler;

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log(`Logged in as ${client.user.tag}!`);
    })
    .catch(error => {
        console.error('Failed to log in:', error);
    });

// Optional: Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});
