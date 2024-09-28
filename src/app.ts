import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { userRoutes } from './controllers/users/routes'
import { transactionRoutes } from './controllers/transactions/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const prisma = new PrismaClient()

const app = fastify({
  logger: false,
})

app.register(userRoutes)
app.register(transactionRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation errors', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external too like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

export { app }
