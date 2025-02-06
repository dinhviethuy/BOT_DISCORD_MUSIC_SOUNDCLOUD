import { Client } from 'discord.js'
import { deploy } from './collections/deloy'

export const bootstrap = (client: Client): void => {
  deploy(client)
}
