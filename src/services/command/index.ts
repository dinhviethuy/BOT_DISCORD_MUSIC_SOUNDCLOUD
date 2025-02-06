import { Client } from 'discord.js'
import { deploy } from './collections/deploy'

export const bootstrap = (client: Client): void => {
  deploy(client)
}
