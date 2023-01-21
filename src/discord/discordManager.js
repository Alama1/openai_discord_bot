const StateHandler = require('./handlers/StateHandler')
const InteractionHandler = require('./handlers/InteractionHandler')
const { Client, IntentsBitField } = require('discord.js')
class DiscordManager  {

    constructor(app) {
        this.app = app
        this.stateHandler = new StateHandler(this)
    }

    connect() {
        const allIntends = new IntentsBitField(9763)
        this.client = new Client({
            cacheGuilds: true,
            cacheChannels: true,
            cacheOverwrites: false,
            cacheRoles: true,
            cacheEmojis: false,
            cachePresences: false,
            intents: allIntends
        })


        this.client.on('ready', () => {
            this.stateHandler.onReady()
            this.interactionHandler = new InteractionHandler(this)
        })

        this.client.on('interactionCreate', interaction => {
            this.interactionHandler.onInteraction(interaction)
        })

        this.client.login(this.app.config.properties.discord.token).catch(error => {
            this.app.log.error(error)
            process.exit(1)
        })
    }
}

module.exports = DiscordManager
