const fs = require('fs')
require('dotenv').config()

class Configuration {
    properties = {
        server: {
            host: 'localhost',
            port: 25565,
        },
        discord: {
            token: null,
            channel: null,
            guildID: null,
            commandRole: '',
            ownerId: '',
        },
        openai: {
            apiKey: null,
        },
        express: {
            port: null
        }
    }

    environmentOverrides = {
        SERVER_HOST: val => (this.properties.server.host = val),
        SERVER_PORT: val => (this.properties.server.port = val),
        DISCORD_TOKEN: val => (this.properties.discord.token = val),
        DISCORD_CHANNEL: val => (this.properties.discord.channel = val),
        DISCORD_COMMAND_ROLE: val => (this.properties.discord.commandRole = val),
        DISCORD_OWNER_ID: val => (this.properties.discord.ownerId = val),
        DISCORD_PREFIX: val => (this.properties.discord.prefix = val),
        MESSAGE_MODE: val => (this.properties.discord.messageMode = val),
    }

    constructor() {
        if (fs.existsSync('config.json')) {
            this.properties = require('../config.json')
            process.env.API_KEY ?
                this.properties.openai.apiKey = process.env.API_KEY : console.log('Env variable of openai api key not found, using one from config...')
            process.env.TOKEN ?
                this.properties.discord.token = process.env.TOKEN : console.log('Env variable of discord token not found, using one from config...')
        }

        for (let environment of Object.keys(process.env)) {
            if (this.environmentOverrides.hasOwnProperty(environment)) {
                this.environmentOverrides[environment](process.env[environment])
            }
        }
    }
}

module.exports = Configuration
