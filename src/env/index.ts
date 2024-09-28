import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3535),
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  DATABASE_URL: z.string().url(),
})

const { data, success, error } = envSchema.safeParse(process.env)

if (!success) {
  console.log('⚠️ Invalid environment variables', error.format())

  throw new Error('Invalid environment variables')
}

export const env = data
