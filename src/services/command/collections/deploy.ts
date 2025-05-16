import { Client, Events as ClientEvents } from 'discord.js'
import { schema } from '../schema'
import envConfig from '~/utils/config'

const authorId: string[] = [envConfig.ADMIN_ID]

export const deploy = (client: Client) => {
  client.on(ClientEvents.MessageCreate, async (message) => {
    if (!message.guild) return
    if (!client.application?.owner) await client.application?.fetch()
    if (
      message.content.toLowerCase() === 'deploy' &&
      (authorId.includes(message.author.id) || message.author.id === client.application?.owner?.id)
    ) {
      try {
        await message.guild.commands.set(schema)
        await message.reply('Deployed commands!')
      } catch (error) {
        console.error('Error deploying commands:', error)
      }
    }
  })
}
