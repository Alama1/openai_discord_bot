const Configuration = require('./Configuration')
const DiscordManager = require('./discord/discordManager')
const ExpressManager = require('./express/index')
const OpenAiManager = require('./openAI/openAiManager')
const Logger = require('./Logger')

class Application {
    async register() {
        this.config = new Configuration()
        this.log = new Logger()
        this.discord = new DiscordManager(this)
        this.openai = new OpenAiManager(this)
        this.express = new ExpressManager(this)
    }

    async connect() {
        this.discord.connect()
        this.express.initialize()
    }
}

module.exports = new Application()
