const { EmbedBuilder } = require('discord.js')
const interactionHandler = require('../handlers/InteractionHandler')
const axios = require("axios");

class inactivityCheckCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'makepic'
        this.openAI = this.discord.app.openai
    }

    async onCommand(interaction) {
        interaction.deferReply()
        const prompt = interaction.options._hoistedOptions[0].value
        const number = interaction.options._hoistedOptions[1].value
        const res = await this.openAI.makeImage(prompt, number)
        if (res.hasOwnProperty('error')) {
            switch (true) {
                case res.error === "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.":
                    interaction.editReply('Такую хуйню генерировать нельзя')
                    break
                default:
                    interaction.editReply('Какая-то ошибка, попробуй позже')

            }
            return
        }
        let response = JSON.parse(res).data.map((url) => {
            return url.url
        })
        this.discord.client.channels.fetch(interaction.channelId).then(channel => {
            response.forEach(pic => {
                channel.send(pic
                )
            })
        })
        interaction.editReply('Done!')
    }
}


module.exports = inactivityCheckCommand
