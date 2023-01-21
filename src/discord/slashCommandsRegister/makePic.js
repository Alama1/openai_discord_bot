const { SlashCommandBuilder } = require('@discordjs/builders');
const InteractionHandler = require('../handlers/InteractionHandler')

class updateKey {
    constructor(interactionHandler) {
        this.interactionHandler = interactionHandler
    }

    data = new SlashCommandBuilder()
        .setName('makepic')
        .setDescription('Create a pictire')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Что именно хочешь?')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Сколько картинок?')
                .setRequired(true)
                .setMaxValue(10)
        )
}

module.exports = updateKey
