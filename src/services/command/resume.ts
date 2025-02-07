import { getVoiceConnection } from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { player, queue_map } from './play'

export const resume = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Tiếp tục phát nhạc'),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
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
      player.unpause()
      connection.subscribe(player)
      player.on('error', (error) => {
        console.error('Lỗi khi tiếp tục nhạc: ', error)
      })
      if (queue_map.length === 0) {
        await interaction.editReply({ content: '🚫 Không còn bài nào để phát' })
        return
      }
      await interaction.editReply({ content: 'Bot đã tiếp tục nhạc!' })
    } catch (error) {
      console.error(error)
      await interaction.reply('Đã có lỗi xảy ra khi tiếp tục nhạc')
    }
  }
}
