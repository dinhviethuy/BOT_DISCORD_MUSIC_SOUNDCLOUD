import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

export const ping = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!')
  }
}
