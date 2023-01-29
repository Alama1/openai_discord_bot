const fs = require('fs')
const path = require('path')
const { Collection, InteractionType, EmbedBuilder } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

class InteractionHandler {
    constructor(discord) {
        this.discord = discord
        this.slashCommandsRegister = []
        this.minecraftManager = this.discord.app.minecraft
        let slashCommandRegisterFiles = fs.readdirSync(path.resolve(__dirname, '../slashCommandsRegister'))
        for (const file of slashCommandRegisterFiles) {
            const command = new (require(path.resolve(__dirname, '../slashCommandsRegister', file)))(this);
            this.slashCommandsRegister.push(command.data)
        }

        this.slashCommands = new Collection()
        let slashCommandFiles = fs.readdirSync(path.resolve(__dirname, '../slashCommands'))
        for (const file of slashCommandFiles) {
            const command = new (require(path.resolve(__dirname, '../slashCommands', file)))(this.discord);
            this.slashCommands.set(command.name, command)
        }
        const rest = new REST({ version: '9' }).setToken(this.discord.app.config.properties.discord.token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationGuildCommands(this.discord.client.user.id, '678539191612866560'),
                    { body: this.slashCommandsRegister },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }

    async onInteraction(interaction) {
        if (!this.canInteract(interaction)) {
            const cannotInteractEmbed = new EmbedBuilder()
                .setColor('#DC143C')
                .setTitle(`Permission denied!`)
                .setDescription('Only staff members can use that!')
            interaction.editReply({
                embeds: [cannotInteractEmbed],
                ephemeral: true
            })
            return
        }

        if (interaction.customId) {
            const command = this.slashCommands.get(interaction.customId) ||
                this.slashCommands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.customId))
            if (!command) return
            command.onCommand(interaction)
            return
        }
        const command = this.slashCommands.get(interaction.commandName)
        if (!command) return
        command.onCommand(interaction)
    }

    canInteract(interaction) {
        return (this.isCommander(interaction) || this.isOwner(interaction))
    }

    isCommander(interaction) {
        return interaction.member._roles.some(role => role === this.discord.app.config.properties.discord.commandRole)
    }

    isOwner(interaction) {
        return interaction.member.id === this.discord.app.config.properties.discord.ownerId
    }
}
module.exports = InteractionHandler
