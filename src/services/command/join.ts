import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js'
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import { queue_map } from './play'

export const join = {
  data: new SlashCommandBuilder().setName('join').setDescription('Bot joins the voice channel'),

  async execute(interaction: ChatInputCommandInteraction) {
    queue_map.length = 0
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true })
      return
    }

    const member = interaction.member as GuildMember
    if (!member.voice.channel) {
      await interaction.reply({ content: 'You must be in a voice channel for me to join.', ephemeral: true })
      return
    }
    await interaction.deferReply()
    const channel = member.voice.channel
    const existingConnection = getVoiceConnection(channel.id)
    if (existingConnection) {
      await interaction.editReply({ content: `I'm already in <#${existingConnection.joinConfig.channelId}>.` })
      return
    }
    console.log(`Attempting to join: ${channel.id}`)
    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true
      })

      if (connection) {
        await interaction.editReply({ content: `✅ Joined <#${channel.id}>!` })
      } else {
        await interaction.editReply({ content: '⚠ Failed to establish a voice connection.' })
      }
    } catch (error) {
      console.error('Error joining voice channel:', error)
      await interaction.editReply({ content: '❌ An error occurred while trying to join the channel.' })
    }
  }
}
