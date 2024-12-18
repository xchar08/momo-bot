# momo-bot

**momo-bot** is a multi-functional Discord bot designed for seamless club role management, user verification, and interactive features like counting games. The bot dynamically handles club configurations, ensuring ease of use and adaptability for your Discord server.

## 📖 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Dynamic Configuration Commands](#dynamic-configuration-commands)
- [Available Commands](#available-commands)
  - [Admin Commands](#admin-commands)
  - [General Commands](#general-commands)
  - [Collaboration Commands](#collaboration-commands)
  - [Ticket Commands](#ticket-commands)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Features

- **Dynamic Club Management:** Automatically manages clubs and their roles based on configuration.
- **User Verification:** Verifies users for clubs, assigning them specific roles dynamically.
- **Temporary Role Verification:** Temporarily verifies users with expiration functionality.
- **Collaboration Channels:** Creates temporary channels for club events and divisions with configurable permissions.
- **Ticketing System:** Facilitates ticket creation for role approvals, with easy approval/rejection handling.
- **Interactive Counting Games:** Manages counting channels with various modes for server engagement.
- **Logging:** Logs important events for server management.
- **Dynamic Role and Category Configuration:** Admins can set roles and categories through commands.

## 🔧 Prerequisites

Ensure the following before installation:

- **Node.js:** Version 16.9.0 or higher (preferably LTS).
- **npm:** Node package manager.
- **Discord Bot Token:** Create one via the [Discord Developer Portal](https://discord.com/developers/applications).

## 🚀 Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/xchar08/momo-bot.git
    cd momo-bot
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    - **Create `.env` File:**

        ```bash
        cp .env.example .env
        ```

    - **Edit `.env`:**

        ```env
        DISCORD_TOKEN=your-discord-bot-token-here
        DEFAULT_PREFIX=!
        ```

4. **Run the Bot:**

    - **Development Mode:**

        ```bash
        npm run dev
        ```

    - **Production Mode:**

        ```bash
        npm start
        ```

## 🛠 Configuration

### 📄 Initial `config.json`

On the first run, the bot generates a `config.json` file in the `config/` directory with the following structure:

```json
{
    "prefixes": {
        "your-guild-id": "!"
    },
    "logChannels": {
        "your-guild-id": ""
    },
    "countingChannels": {
        "your-guild-id": []
    },
    "countingModes": {},
    "countingCounts": {},
    "verificationRole": "",
    "unverifiedRole": "",
    "adminRole": "",
    "archiveCategoryId": "",
    "collabCategoryId": "",
    "ticketCategoryId": ""
}
```

Admins can dynamically update these configurations using commands.

---

## 📜 Available Commands

### 🛡️ Admin Commands

- `!addclub <clubName>`: Adds a new club.
- `!removeclub <clubName>`: Removes an existing club.
- `!setadminrole <@role>`: Sets the admin role.
- `!setarchivecategory <categoryName>`: Sets the archive category.
- `!setcollabcategory <categoryName>`: Sets the collaboration category.
- `!setticketcategory <categoryName>`: Sets the ticket category.
- `!setverifrole <@role>`: Sets the verification role.
- `!setunverifrole <@role>`: Sets the unverified role.
- `!forceverify @user <clubName> <position> <realName> [duration]`: Temporarily verifies a user with optional duration.
- `!checkdurations`: Lists all temporary verifications and their expiration times.
- `!unverify @user`: Unverifies a member by removing their club and verification roles.

### 📋 General Commands

- `!commands`: Lists all available commands.
- `!ping`: Responds with Pong!

### 🤝 Collaboration Commands

- `!collab <club1,club2,...> <eventName>`: Creates a collaboration channel involving specified clubs.
- `!close`: Archives the current collaboration channel.

### 📩 Ticket Commands

- `!ticket <clubName> @user <realName>`: Creates a ticket for role approval.
- `!approve @user <role>`: Approves a ticket and assigns the specified role.
- `!reject <reason>`: Rejects a ticket with a reason.

---

## 🛡️ Best Practices

- **Use Appropriate Permissions:** Ensure the bot has the necessary permissions to manage roles and channels.
- **Set Admin Roles:** Use `!setadminrole` to assign admin privileges.
- **Audit Logs:** Regularly check the logs for any unusual activity.

---

## 🛠 Troubleshooting

- **Permission Issues:** Verify that the bot's role is higher than the roles it is managing.
- **Configuration Errors:** Use `!commands` to verify the current configuration.
- **Bot Not Responding:** Restart the bot and check `.env` for correct credentials.

---

## 🤝 Contributing

We welcome contributions! Feel free to submit issues or pull requests on the GitHub repository.

---

## 📜 License

This project is licensed under the MIT License.
