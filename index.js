// index.js
const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents } = require('discord.js');
const configHandler = require('./config/configHandler');
require('dotenv').config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_ROLES,
    ],
});

client.commands = new Collection();

// Function to recursively load commands
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const filePath = path.join(dir, file);
        const command = require(filePath);
        client.commands.set(command.name, command);
    }

    // Load commands in subdirectories
    const subdirs = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const subdir of subdirs) {
        loadCommands(path.join(dir, subdir));
    }
};

// Load all commands
const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

// Function to recursively load events
const loadEvents = (dir) => {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const filePath = path.join(dir, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    // Load events in subdirectories
    const subdirs = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const subdir of subdirs) {
        loadEvents(path.join(dir, subdir));
    }
};

// Load all events
const eventsPath = path.join(__dirname, 'events');
loadEvents(eventsPath);

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
