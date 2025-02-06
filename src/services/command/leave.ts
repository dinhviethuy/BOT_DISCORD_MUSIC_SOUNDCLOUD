import { getVoiceConnection } from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { player, queue_map } from './play'

export const leave = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Rời khỏi kênh thoại'),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply({ ephemeral: true })
      const member = interaction.member as GuildMember
      if (!member.voice.channel) {
        await interaction.editReply({ content: 'Bot không ở trong kênh thoại nào!' })
        return
      }
      const channel = member.voice.channel
      const connection = getVoiceConnection(channel.guild.id)
      if (!connection) {
        await interaction.editReply({ content: 'Bot không ở kênh này' })
        return
      }
      player.stop()
      queue_map.length = 0
      connection.destroy()
      await interaction.editReply({ content: 'Left the voice channel.' })
    } catch (error) {
      console.error(error)
      await interaction.reply('Đã có lỗi xảy ra khi rời khỏi kênh thoại')
    }
  }
}
