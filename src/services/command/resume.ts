import { getVoiceConnection } from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { player } from './play'

export const resume = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Tiếp tục phát nhạc'),

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
    player.unpause()
    connection.subscribe(player)
    player.on('error', (error) => {
      console.error('Lỗi khi tiếp tục nhạc: ', error)
    })
    await interaction.editReply({ content: 'Bot đã tiếp tục nhạc!' })
  }
}
