# Discord Bot

A comprehensive and organized Discord bot built with `discord.js`.

## Features

- **Verification System**: Assigns roles and updates nicknames upon verification.
- **Admin Configurations**: Set admin and verification roles, log channels, archive and collaboration categories, and custom command prefixes via commands.
- **Club Management**: Add new clubs with specific configurations, including officer roles and additional roles.
- **Collaboration Channels**: Create temporary collaboration channels for planning events or divisions.
- **Ticket System**: Create ticket channels for admin approval of officer roles.
- **Logging System**: Logs various events like message deletions, edits, role changes, and channel creations/deletions.
- **Override Mechanism**: Temporarily assign officer roles beyond the set limit.
- **Counting Game**: Engage in a fun counting game with multiple counting modes.
- **Utility Commands**: Ping command to check bot responsiveness and a command to list all available commands.

## Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone https://github.com/xchar08/momo-bot.git
    cd momo-bot
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    - Ensure you have a `.env` file set up with your Discord bot token and desired prefix.

4. **Configure the Bot**

    - Use the available admin commands to set roles, channels, categories, and add clubs.

5. **Start the Bot**

    ```bash
    npm start
    ```

## Commands Overview

### **Admin Commands**

- `!setadminrole @role`: Sets the admin role.
- `!setverifrole @role`: Sets the verification role.
- `!setlogchannel #channel`: Sets the log channel.
- `!setarchivecategory #category`: Sets the archive category.
- `!setcollabcategory #category`: Sets the collaboration category.
- `!setprefix <new_prefix>`: Sets a custom command prefix.
- `!addclub <club name> <max officers> <officer roles (comma-separated)> <additional roles (comma-separated)>`: Adds a new club.
- `!setcountingchannel add #channel`: Adds a channel as a counting channel.
- `!setcountingchannel remove #channel`: Removes a channel from counting channels.
- `!setcountingchannel list`: Lists all counting channels.
- `!setcountingmode #channel <mode>`: Sets the counting mode for a counting channel.

### **General Commands**

- `!ping`: Checks bot latency.
- `!commands`: Lists all available commands.

### **Club Commands**

- `!addclub <club name> <max officers> <officer roles (comma-separated)> <additional roles (comma-separated)>`: Adds a new club.

### **Collaboration Commands**

- `!collab <club name(s)> <event or division name>`: Creates a collaboration channel.

### **Ticket Commands**

- `!ticket <club name> @member <IRL name>`: Creates a ticket channel for approvals.

### **Override Commands**

- `!override <club name> @member <club role> <IRL name>`: Temporarily assigns officer roles beyond limits.

### **Counting Game Commands**

- **Set Counting Channel:**
    - `!setcountingchannel add #channel`: Adds a channel as a counting channel.
    - `!setcountingchannel remove #channel`: Removes a channel from counting channels.
    - `!setcountingchannel list`: Lists all counting channels.

- **Set Counting Mode:**
    - `!setcountingmode #channel <mode>`: Sets the counting mode for a counting channel.
    - **Available Modes:** `normal`, `hex`, `binary`, `count2`, `count3`, `count4`, `count5`, `countdown`

## Permissions Required

Ensure your bot has the following permissions in your Discord server:

- Manage Roles
- Manage Channels
- Send Messages
- Read Message History
- View Channels
- Change Nickname
- Add Reactions
- Manage Messages (if auto-deleting messages in counting channels)

## Counting Game Modes

1. **Normal:** Count by 1 (1, 2, 3, ...)
2. **Hexadecimal:** Count in hexadecimal (1, 2, 3, ..., A, B, C, ...)
3. **Binary:** Count in binary (1, 10, 11, 100, ...)
4. **Count by 2s:** 1, 3, 5, 7, ...
5. **Count by 3s:** 1, 4, 7, 10, ...
6. **Count by 4s:** 1, 5, 9, 13, ...
7. **Count by 5s:** 1, 6, 11, 16, ...
8. **Countdown from 1000:** 1000, 999, 998, ...

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or feature additions.

## License

This project is licensed under the MIT License.
