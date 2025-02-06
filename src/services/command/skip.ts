import { AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { player } from './play'

export const skip = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Bỏ qua bài hát hiện tại'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const member = interaction.member as GuildMember
    if (!member.voice.channel) {
      await interaction.editReply({ content: 'Bạn phải ở trong một kênh thoại để sử dụng lệnh' })
      return
    }
    const channel = member.voice.channel
    const connection = getVoiceConnection(channel.guild.id)
    if (!connection) {
      await interaction.editReply({ content: 'Bot chưa được join vào kênh thoại. Vui lòng sử dụng lệnh join trước!' })
      return
    }
    if (player.state.status !== AudioPlayerStatus.Playing) {
      await interaction.editReply({ content: '🚫 Không có bài hát nào đang phát!' })
      return
    }
    player.stop()
    await interaction.editReply({ content: '⏭️ Đã bỏ qua bài hát!' })
    player.on('error', (error) => {
      console.error('Lỗi khi tiếp tục nhạc: ', error)
    })
  }
}
