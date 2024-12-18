const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const stat = fs.statSync(folderPath);

        if (stat.isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);

                if (!command.name || !command.execute) {
                    console.warn(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
                    continue;
                }

                client.commands.set(command.name, command);
                console.log(`Loaded command: ${command.name}`);
            }
        }
    }
};
