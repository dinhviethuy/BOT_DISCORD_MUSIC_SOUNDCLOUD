import { Client, Collection, CommandInteraction, Events, GatewayIntentBits } from 'discord.js'
import { bootstrap } from './command'
import { ping } from './command/ping'
import { join } from './command/join'
import { play_song } from './command/play'
import { pause } from './command/pause'
import { leave } from './command/leave'
import { resume } from './command/resume'
import { skip } from './command/skip'
import envConfig from '~/utils/config'

const TOKEN = envConfig.TOKEN
const commands = new Collection<string, any>()
commands.set(ping.data.name, ping)
commands.set(join.data.name, join)
commands.set(play_song.data.name, play_song)
commands.set(pause.data.name, pause)
commands.set(resume.data.name, resume)
commands.set(leave.data.name, leave)
commands.set(skip.data.name, skip)

const connect = () => {
  try {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
      ]
    })

    client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    })
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) return
      const command = commands.get(interaction.commandName)
      if (!command) return
      try {
        await command.execute(interaction as CommandInteraction)
      } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true })
      }
    })

    client.login(TOKEN).then(() => {
      bootstrap(client)
    })
  } catch (error) {
    console.error('Error connecting to Discord:', error)
  }
}

export default connect
