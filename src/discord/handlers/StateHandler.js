const {EmbedBuilder} = require('discord.js')

class StateHandler {
    constructor(discord) {
        this.discord = discord
    }

    async onReady() {
        this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
        this.discord.client.user.setActivity('Chat', { type: 'WATCHING' })

        this.discord.client.channels.fetch(this.discord.app.config.properties.discord.channel).then(channel => {
            const readyEmbed = new EmbedBuilder()
                .setTitle('OpenAI bot is online')
                .setColor('#FFFF00')
            channel.send({
                embeds: [readyEmbed]
            })
        })
    }

    onClose() {
        this.discord.client.channels.fetch(this.discord.app.config.properties.discord.channel).then(channel => {
            const readyEmbed = new EmbedBuilder()
                .setTitle('OpenAI bot is offline')
                .setColor('#E55555')
            channel.send({
                embeds: [readyEmbed]
            }).then(() => { process.exit() })
        }).catch(() => { process.exit() })
    }
}

module.exports = StateHandler
