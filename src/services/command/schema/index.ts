import { ApplicationCommandData, ApplicationCommandOptionType } from 'discord.js'

export const schema: ApplicationCommandData[] = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'join',
    description: 'Bot joins the voice channel'
  },
  {
    name: 'play',
    description: 'Play a song',
    options: [
      {
        name: 'name',
        description: 'Tên bài hát để tìm kiếm và phát',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  {
    name: 'pause',
    description: 'Dừng phát nhạc'
  },
  {
    name: 'resume',
    description: 'Tiếp tục phát nhạc'
  },
  {
    name: 'leave',
    description: 'Rời khỏi kênh thoại'
  },
  {
    name: 'skip',
    description: 'Bỏ qua bài hát hiện tại'
  }
]
