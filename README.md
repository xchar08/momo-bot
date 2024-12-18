# momo-bot

**momo-bot** is a versatile Discord bot designed to manage club roles, facilitate user verification, and provide interactive features like counting games. It dynamically handles club configurations, ensuring flexibility and scalability within your Discord server.

## 📖 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Dynamic Configuration Commands](#dynamic-configuration-commands)
- [Available Commands](#available-commands)
  - [Admin Commands](#admin-commands)
  - [General Commands](#general-commands)
- [Best Practices](#best-practices)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Features

- **Dynamic Club Management:** Automatically manages clubs based on role creation, simplifying the process of adding or removing clubs.
- **User Verification:** Allows users to verify for specific clubs and assigns corresponding roles.
- **Counting Games:** Facilitates interactive counting games across designated channels.
- **Logging:** Logs important actions and events for auditing purposes.
- **Role Configuration:** Admins can dynamically set roles and categories via commands.

## 🔧 Prerequisites

Before setting up **momo-bot**, ensure you have the following:

- **Node.js:** Version 16.6.0 or higher.
- **npm:** Node package manager.
- **Discord Bot Token:** Create a bot via the [Discord Developer Portal](https://discord.com/developers/applications).

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

    - Rename `.env.example` to `.env`:

        ```bash
        cp .env.example .env
        ```

    - Open `.env` and add your Discord bot token:

        ```env
        DISCORD_TOKEN=your-discord-bot-token-here
        DEFAULT_PREFIX=!
        ```

4. **Run the Bot:**

    ```bash
    node index.js
    ```

    Or, if using nodemon for development:

    ```bash
    npx nodemon index.js
    ```

## 🛠 Configuration

### 📄 Initial `config.json`

Upon the first run, a `config.json` file will be generated in the `config/` directory with the following structure:

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
    "clubs": {},
    "adminRole": "",
    "archiveCategoryId": "",
    "collabCategoryId": ""
}
