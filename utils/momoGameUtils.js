function decayStats(momo) {
    const now = Date.now();
    const timePassed = (now - momo.lastInteraction) / 60000; // Minutes passed
    momo.lastInteraction = now;

    momo.hunger = Math.max(0, momo.hunger - timePassed * 2);
    momo.happiness = Math.max(0, momo.happiness - timePassed * 2);
    momo.health = Math.max(0, momo.health - timePassed * 2);

    if (momo.hunger <= 0 || momo.happiness <= 0) {
        momo.health = Math.max(0, momo.health - timePassed * 5);
    }
}

function trackContribution(momo, userId, action) {
    if (!momo.contributors[userId]) {
        momo.contributors[userId] = { feed: 0, play: 0 };
    }
    momo.contributors[userId][action] += 1;
}

function checkMilestone(momo, message) {
    if (momo.hunger === 100 && momo.happiness === 100 && momo.health === 100) {
        message.channel.send('🎉 The mini Momo is thriving! You are doing a great job!');
    }
}

module.exports = { decayStats, trackContribution, checkMilestone };
