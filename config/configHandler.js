// config/configHandler.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

// Initialize default config
let config = {
    prefixes: {},
    logChannels: {},
    countingChannels: {},
    countingModes: {},
    countingCounts: {},
    verificationRole: "",
    unverifiedRole: "",
    clubs: {}, // { clubName: { members: { position: userId }, maxMembers: 5 } }
    adminRole: "",
    archiveCategoryId: "",
    collabCategoryId: ""
};

// Load existing config or create new one
if (fs.existsSync(configPath)) {
    try {
        const data = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(data);
        console.log('Loaded existing config.json');
    } catch (error) {
        console.error('Error reading config.json:', error);
    }
} else {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log('Created default config.json');
}

// Function to save the configuration
const saveConfig = () => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        console.log('config.json has been updated.');
    } catch (error) {
        console.error('Error writing to config.json:', error);
    }
};

// Getter and Setter Functions

const getPrefix = (guildId) => {
    return config.prefixes[guildId] || '!';
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

const setAdminRole = (roleId) => {
    config.adminRole = roleId;
    saveConfig();
};

const getVerificationRole = () => {
    return config.verificationRole;
};

const setVerificationRole = (roleId) => { // Store by ID
    config.verificationRole = roleId;
    saveConfig();
};

const getUnverifiedRole = () => { // Getter for unverifiedRole
    return config.unverifiedRole;
};

const setUnverifiedRole = (roleId) => { // Setter for unverifiedRole
    config.unverifiedRole = roleId;
    saveConfig();
};

// Club Functions

const addClub = (clubName) => {
    if (config.clubs[clubName]) {
        throw new Error(`Club "${clubName}" already exists.`);
    }
    config.clubs[clubName] = {
        members: {}, // { position: userId }
        maxMembers: 5
    };
    saveConfig();
};

const removeClub = (clubName) => {
    if (!config.clubs[clubName]) {
        throw new Error(`Club "${clubName}" does not exist.`);
    }
    delete config.clubs[clubName];
    saveConfig();
};

const assignMemberToClub = (clubName, position, userId) => {
    if (!config.clubs[clubName]) {
        throw new Error(`Club "${clubName}" does not exist.`);
    }
    const club = config.clubs[clubName];
    if (Object.keys(club.members).length >= club.maxMembers) {
        throw new Error(`Club "${clubName}" has reached its maximum of ${club.maxMembers} members.`);
    }
    if (club.members[position]) {
        throw new Error(`Position "${position}" in club "${clubName}" is already occupied.`);
    }
    club.members[position] = userId;
    saveConfig();
};

const removeMemberFromClub = (clubName, userId) => {
    if (!config.clubs[clubName]) {
        throw new Error(`Club "${clubName}" does not exist.`);
    }
    const club = config.clubs[clubName];
    for (const [position, memberId] of Object.entries(club.members)) {
        if (memberId === userId) {
            delete club.members[position];
            saveConfig();
            return;
        }
    }
    throw new Error(`User is not a member of club "${clubName}".`);
};

const getClubMembers = (clubName) => {
    if (!config.clubs[clubName]) {
        throw new Error(`Club "${clubName}" does not exist.`);
    }
    return config.clubs[clubName].members; // Returns { position: userId }
};

const getAllClubs = () => {
    return config.clubs;
};

// Archive Category

const setArchiveCategory = (categoryId) => {
    config.archiveCategoryId = categoryId;
    saveConfig();
};

const getArchiveCategory = () => {
    return config.archiveCategoryId;
};

// Collaboration Category

const setCollabCategory = (categoryId) => {
    config.collabCategoryId = categoryId;
    saveConfig();
};

const getCollabCategory = () => {
    return config.collabCategoryId;
};

// Counting Channels

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
        // Also remove mode and count
        delete config.countingModes[channelId];
        delete config.countingCounts[channelId];
        saveConfig();
    }
};

const clearCountingChannels = (guildId) => {
    config.countingChannels[guildId] = [];
    // Optionally, clear modes and counts
    Object.keys(config.countingModes).forEach(channelId => {
        if (config.countingChannels[guildId].includes(channelId)) {
            delete config.countingModes[channelId];
            delete config.countingCounts[channelId];
        }
    });
    saveConfig();
};

// Counting Modes

const getCountingMode = (channelId) => {
    return config.countingModes[channelId] || 'normal';
};

const setCountingMode = (channelId, mode) => {
    config.countingModes[channelId] = mode;
    // Initialize count based on mode
    if (mode === 'countdown') {
        config.countingCounts[channelId] = 1000;
    } else {
        config.countingCounts[channelId] = 1;
    }
    saveConfig();
};

// Counting Counts

const getCountingCount = (channelId) => {
    return config.countingCounts[channelId] || 1;
};

const setCountingCount = (channelId, count) => {
    config.countingCounts[channelId] = count;
    saveConfig();
};

const resetCountingCount = (channelId) => {
    const mode = getCountingMode(channelId);
    if (mode === 'countdown') {
        config.countingCounts[channelId] = 1000;
    } else {
        config.countingCounts[channelId] = 1;
    }
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
    getUnverifiedRole,
    setUnverifiedRole,
    addClub,
    removeClub,
    assignMemberToClub,
    removeMemberFromClub,
    getClubMembers,
    getAllClubs,
    setArchiveCategory,
    getArchiveCategory,
    setCollabCategory,
    getCollabCategory,
    getCountingChannels,
    addCountingChannel,
    removeCountingChannel,
    clearCountingChannels,
    getCountingMode,
    setCountingMode,
    getCountingCount,
    setCountingCount,
    resetCountingCount,
};
