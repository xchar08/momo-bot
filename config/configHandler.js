const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

// Load existing configuration or initialize a default one
let config = {};
if (fs.existsSync(configPath)) {
    try {
        const data = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(data);
        console.log('Loaded existing config.json');
    } catch (error) {
        console.error('Error reading config.json:', error);
    }
} else {
    config = {
        prefixes: {},
        logChannels: {},
        countingChannels: {},
        countingModes: {},
        countingCounts: {},
        verificationRole: "",
        unverifiedRole: "",
        clubs: {},
        adminRole: "",
        archiveCategoryId: "",
        collabCategoryId: ""
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log('Created default config.json');
}

// Save the configuration to the file
const saveConfig = () => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        console.log('config.json has been updated.');
    } catch (error) {
        console.error('Error writing to config.json:', error);
    }
};

// Ensure a club exists with the proper structure
const initializeClub = (clubName) => {
    if (!config.clubs[clubName]) {
        config.clubs[clubName] = {
            members: {},  // Position to user ID mapping
            maxMembers: 5 // Default maximum club members
        };
        saveConfig();
    }
};

// Configuration Handler
module.exports = {
    // Prefix
    getPrefix: (guildId) => config.prefixes[guildId] || '!',
    setPrefix: (guildId, newPrefix) => {
        config.prefixes[guildId] = newPrefix;
        saveConfig();
    },

    // Log Channel
    getLogChannel: (guildId) => config.logChannels[guildId] || null,
    setLogChannel: (guildId, channelId) => {
        config.logChannels[guildId] = channelId;
        saveConfig();
    },

    // Admin Role
    getAdminRole: () => config.adminRole || '',
    setAdminRole: (roleId) => {
        config.adminRole = roleId;
        saveConfig();
    },

    // Verification Role
    getVerificationRole: () => config.verificationRole || '',
    setVerificationRole: (roleId) => {
        config.verificationRole = roleId;
        saveConfig();
    },

    // Unverified Role
    getUnverifiedRole: () => config.unverifiedRole || '',
    setUnverifiedRole: (roleId) => {
        config.unverifiedRole = roleId;
        saveConfig();
    },

    // Clubs
    addClub: (clubName) => {
        initializeClub(clubName); // Ensure structure
    },
    removeClub: (clubName) => {
        if (config.clubs[clubName]) {
            delete config.clubs[clubName];
            saveConfig();
        } else {
            throw new Error(`Club "${clubName}" does not exist.`);
        }
    },
    assignMemberToClub: (clubName, position, userId) => {
        initializeClub(clubName); // Ensure structure
        const club = config.clubs[clubName];
        if (Object.keys(club.members).length >= club.maxMembers) {
            throw new Error(`Club "${clubName}" is full.`);
        }
        if (club.members[position]) {
            throw new Error(`Position "${position}" is already occupied.`);
        }
        club.members[position] = userId;
        saveConfig();
    },
    removeMemberFromClub: (clubName, userId) => {
        initializeClub(clubName); // Ensure structure
        const club = config.clubs[clubName];
        for (const [position, memberId] of Object.entries(club.members)) {
            if (memberId === userId) {
                delete club.members[position];
                saveConfig();
                return;
            }
        }
        throw new Error(`User is not a member of club "${clubName}".`);
    },
    getClubMembers: (clubName) => {
        initializeClub(clubName); // Ensure structure
        return config.clubs[clubName].members;
    },
    getAllClubs: () => config.clubs,

    // Archive and Collaboration Categories
    setArchiveCategory: (categoryId) => {
        config.archiveCategoryId = categoryId;
        saveConfig();
    },
    getArchiveCategory: () => config.archiveCategoryId,
    setCollabCategory: (categoryId) => {
        config.collabCategoryId = categoryId;
        saveConfig();
    },
    getCollabCategory: () => config.collabCategoryId,

    // Counting Channels
    getCountingChannels: (guildId) => config.countingChannels[guildId] || [],
    addCountingChannel: (guildId, channelId) => {
        if (!config.countingChannels[guildId]) config.countingChannels[guildId] = [];
        if (!config.countingChannels[guildId].includes(channelId)) {
            config.countingChannels[guildId].push(channelId);
            saveConfig();
        }
    },
    removeCountingChannel: (guildId, channelId) => {
        if (config.countingChannels[guildId]) {
            config.countingChannels[guildId] = config.countingChannels[guildId].filter(id => id !== channelId);
            saveConfig();
        }
    },

    // Counting Modes
    getCountingMode: (channelId) => config.countingModes[channelId] || 'normal',
    setCountingMode: (channelId, mode) => {
        config.countingModes[channelId] = mode;
        saveConfig();
    },
    getCountingCount: (channelId) => config.countingCounts[channelId] || 1,
    setCountingCount: (channelId, count) => {
        config.countingCounts[channelId] = count;
        saveConfig();
    },
    resetCountingCount: (channelId) => {
        config.countingCounts[channelId] = 1;
        saveConfig();
    }
};
