// configHandler.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

// Load configuration
let config = {
    prefixes: {},
    logChannels: {},
    countingChannels: {},
    verificationRole: "",
    clubs: {},
    adminRole: "",
    archiveCategoryId: "",
    collabCategoryId: ""
};

// Check if config.json exists
if (fs.existsSync(configPath)) {
    try {
        const data = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(data);
    } catch (error) {
        console.error('Error reading config.json:', error);
    }
} else {
    // Write the default config to config.json
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log('Created default config.json');
}

// Function to save the configuration
const saveConfig = () => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

// Getter and Setter Functions
const getPrefix = (guildId) => {
    return config.prefixes[guildId] || process.env.DEFAULT_PREFIX || '!';
};

const setPrefix = (guildId, newPrefix) => {
    config.prefixes[guildId] = newPrefix;
    saveConfig();
};

const getLogChannel = (guildId) => {
    return config.logChannels[guildId] || null;
};

const setLogChannel = (guildId, channelId) => {
    config.logChannels[guildId] = channelId;
    saveConfig();
};

const getAdminRole = () => {
    return config.adminRole;
};

const setAdminRole = (newRoleName) => {
    config.adminRole = newRoleName;
    saveConfig();
};

const getVerificationRole = () => {
    return config.verificationRole;
};

const setVerificationRole = (newRoleName) => {
    config.verificationRole = newRoleName;
    saveConfig();
};

const getClubConfig = (clubName) => {
    return config.clubs[clubName] || null;
};

const addClub = (clubName, maxOfficers, officerRoles, additionalRoles) => {
    config.clubs[clubName] = {
        maxOfficers: maxOfficers,
        officerRoles: officerRoles,
        additionalRoles: additionalRoles
    };
    saveConfig();
};

const removeClub = (clubName) => {
    delete config.clubs[clubName];
    saveConfig();
};

const getAllClubs = () => {
    return config.clubs;
};

const setArchiveCategory = (categoryId) => {
    config.archiveCategoryId = categoryId;
    saveConfig();
};

const setCollabCategory = (categoryId) => {
    config.collabCategoryId = categoryId;
    saveConfig();
};

// **New Getter and Setter for Counting Channels**

const getCountingChannels = (guildId) => {
    return config.countingChannels[guildId] || [];
};

const addCountingChannel = (guildId, channelId) => {
    if (!config.countingChannels[guildId]) {
        config.countingChannels[guildId] = [];
    }
    if (!config.countingChannels[guildId].includes(channelId)) {
        config.countingChannels[guildId].push(channelId);
        saveConfig();
    }
};

const removeCountingChannel = (guildId, channelId) => {
    if (config.countingChannels[guildId]) {
        config.countingChannels[guildId] = config.countingChannels[guildId].filter(id => id !== channelId);
        saveConfig();
    }
};

const clearCountingChannels = (guildId) => {
    config.countingChannels[guildId] = [];
    saveConfig();
};

module.exports = {
    getPrefix,
    setPrefix,
    getLogChannel,
    setLogChannel,
    getAdminRole,
    setAdminRole,
    getVerificationRole,
    setVerificationRole,
    getClubConfig,
    addClub,
    removeClub,
    getAllClubs,
    setArchiveCategory,
    setCollabCategory,
    getCountingChannels,      // New
    addCountingChannel,       // New
    removeCountingChannel,    // New
    clearCountingChannels     // New
};
