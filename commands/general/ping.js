// ping.js
module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    category: 'General',
    async execute(message, args, client) {
        const sent = await message.channel.send('Pinging...');
        sent.edit(`Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms`);
    },
};
