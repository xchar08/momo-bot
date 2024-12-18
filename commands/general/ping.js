// commands/general/ping.js
module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    category: 'General',
    async execute(message, args, client) {
        try {
            const sentMessage = await message.channel.send('Pinging...');
            const latency = sentMessage.createdTimestamp - message.createdTimestamp;
            sentMessage.edit(`Pong! Latency: ${latency}ms`);
        } catch (error) {
            console.error('Error executing ping command:', error);
            message.channel.send('❌ An error occurred while executing that command.');
        }
    },
};
