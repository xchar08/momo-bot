# Momo Bot

A comprehensive and organized Discord bot built with `discord.js`.

## Features

- **Verification System**: Assigns roles and updates nicknames upon verification.
- **Admin Configurations**: Set admin and verification roles, log channels, archive and collaboration categories, and custom command prefixes via commands.
- **Club Management**: Add new clubs with specific configurations, including officer roles and additional roles.
- **Collaboration Channels**: Create temporary collaboration channels for planning events or divisions.
- **Ticket System**: Create ticket channels for admin approval of officer roles.
- **Logging System**: Logs various events like message deletions, edits, role changes, and channel creations/deletions.
- **Override Mechanism**: Temporarily assign officer roles beyond the set limit.
- **Utility Commands**: Ping command to check bot responsiveness and a command to list all available commands.

## Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone https://github.com/xchar08/momo-bot.git
    cd discord-bot
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    - Rename `.env.example` to `.env` and fill in your Discord bot token.

4. **Configure the Bot**

    - Use the available admin commands to set roles, channels, categories, and add clubs.

5. **Start the Bot**

    ```bash
    npm start
    ```

## Commands Overview

- `!setadminrole @role`: Sets the admin role.
- `!setverifrole @role`: Sets the verification role.
- `!setlogchannel #channel`: Sets the log channel.
- `!setarchivecategory #category`: Sets the archive category.
- `!setcollabcategory #category`: Sets the collaboration category.
- `!setprefix <new_prefix>`: Sets a custom command prefix.
- `!addclub <club name> <max officers> <officer roles (comma-separated)> <additional roles (comma-separated)>`: Adds a new club.
- `!ping`: Checks bot latency.
- `!commands`: Lists all available commands.
- `!collab <club name(s)> <event or division name>`: Creates a collaboration channel.
- `!ticket <club name> @member <IRL name>`: Creates a ticket channel for approvals.
- `!override <club name> @member <club role> <IRL name>`: Temporarily assigns officer roles beyond limits.
- `!close`: Closes and archives the current channel (use within ticket or collaboration channels).

## Permissions Required

Ensure your bot has the following permissions in your Discord server:

- Manage Roles
- Manage Channels
- Send Messages
- Read Message History
- View Channels
- Change Nickname

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or feature additions.

## License

This project is licensed under the MIT License.

