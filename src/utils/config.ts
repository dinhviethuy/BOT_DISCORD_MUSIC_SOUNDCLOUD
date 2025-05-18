import fs from 'fs'
import { config } from 'dotenv'
import z from 'zod'

config({
  path: '.env'
})

if (!fs.existsSync('.env')) {
  throw new Error('No .env file found')
}

const configSchema = z.object({
  TOKEN: z.string(),
  SOUNDCLOUD_CLIENT_ID: z.string(),
  ADMIN_ID: z.string(),
  AUTHOR_AVATAR_URL: z.string()
})

const configEnv = configSchema.safeParse(process.env)

if (!configEnv.success) {
  console.error('Please check the .env file')
  console.error(configEnv.error.format())
  process.exit(1)
}

const envConfig = configEnv.data

export default envConfig
