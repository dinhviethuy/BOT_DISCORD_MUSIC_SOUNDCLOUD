import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection
} from '@discordjs/voice'
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import play from 'play-dl'
import { config } from 'dotenv'

config()
play.setToken({
  soundcloud: {
    client_id: process.env.SOUNDCLOUD_CLIENT_ID || ''
  }
})

let lastInteraction: ChatInputCommandInteraction | null = null
let lastConnection: VoiceConnection | null = null

export const queue_map: string[] = []

export const player = createAudioPlayer()

async function playNextSong() {
  if (queue_map.length === 0) {
    if (lastInteraction) {
      lastInteraction.editReply({ content: 'Hết bài hát để phát!' })
    }
    return
  }
  const songName = queue_map.shift()
  try {
    const searchResults = await play.search(songName!, {
      source: {
        soundcloud: 'tracks'
      }
    })

    if (searchResults.length === 0) {
      if (lastInteraction) {
        lastInteraction.editReply({ content: '❌ Không tìm thấy bài hát trên SoundCloud!' })
      }
      return
    }

    const song = searchResults[0]
    const url = song.url
    const title = song.name
    const audio = await play.stream(url)
    const resource = createAudioResource(audio.stream, { inputType: audio.type })
    player.play(resource)
    lastConnection?.subscribe(player)
    if (lastInteraction) {
      lastInteraction.editReply({ content: `Đang phát: **${title}**` })
    }
  } catch (error) {
    console.error(`Lỗi khi phát nhạc: ${error}`)
  }
}

player.on(AudioPlayerStatus.Idle, () => {
  if (lastInteraction) {
    playNextSong()
  }
})

// export const play_song = {
//   data: new SlashCommandBuilder()
//     .setName('play')
//     .setDescription('Play a song')
//     .addStringOption((option) =>
//       option.setName('name').setDescription('Tên bài hát để tìm kiếm và phát').setRequired(true)
//     ),

//   async execute(interaction: ChatInputCommandInteraction) {
//     try {
//       lastInteraction = interaction
//       await interaction.deferReply({ ephemeral: true })
//       const name = interaction.options.getString('name')?.trim()
//       const member = interaction.member as GuildMember
//       if (!member.voice.channel) {
//         await interaction.editReply({ content: 'Bạn phải ở trong một kênh thoại để play' })
//         return
//       }
//       const channel = member.voice.channel
//       const connection = getVoiceConnection(channel.guild.id)
//       if (!connection) {
//         await interaction.editReply({ content: 'Bot chưa được join vào kênh thoại. Vui lòng sử dụng lệnh ``/join`` trước!' })
//         return
//       }
//       queue_map.push(name!)
//       const songName = queue_map.shift()
//       const searchResults = await play.search(songName!, {
//         source: {
//           soundcloud: 'tracks'
//         }
//       })
//       if (searchResults.length === 0) {
//         return interaction.reply('❌ Không tìm thấy bài hát trên SoundCloud!')
//       }
//       if (player.state.status !== AudioPlayerStatus.Playing) {
//         playNextSong()
//       }
//       await interaction.editReply({ content: `Đã thêm **${name}** vào hàng đợi!` })
//     } catch (error) {
//       console.error('Error playing soundCloud:', error)
//     }
//   }
// }

export const play_song = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát một bài hát')
    .addStringOption((option) =>
      option.setName('name').setDescription('Tên bài hát để tìm kiếm và phát').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      lastInteraction = interaction
      await interaction.deferReply({ ephemeral: true })
      const name = interaction.options.getString('name')?.trim()
      const member = interaction.member as GuildMember
      if (!member.voice.channel) {
        await interaction.editReply({ content: 'Bạn phải ở trong một kênh thoại để phát nhạc!' })
        return
      }
      const channel = member.voice.channel
      let connection = getVoiceConnection(channel.guild.id)
      if (!connection) {
        queue_map.length = 0
        player.stop()
        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf: true
        })
        if (connection) {
          await interaction.editReply({ content: `✅ Joined <#${channel.id}>!` })
        }
      } else {
        if (connection.joinConfig.channelId !== channel.id) {
          queue_map.length = 0
          player.stop()
          connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
          })
          if (connection) {
            await interaction.editReply({ content: `✅ Joined <#${channel.id}>!` })
          }
        }
      }
      lastConnection = connection
      queue_map.push(name!)
      lastInteraction = interaction
      if (player.state.status !== AudioPlayerStatus.Playing && player.state.status !== AudioPlayerStatus.Paused) {
        playNextSong()
      } else {
        await interaction.editReply({ content: `✅ Đã thêm **${name}** vào hàng chờ!` })
      }
    } catch (error) {
      console.error('Error playing SoundCloud:', error)
    }
  }
}
