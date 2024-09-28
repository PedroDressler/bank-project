import { FastifyInstance } from 'fastify'
import { createTransaction } from './create-transaction.controller'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/transactions', createTransaction)
}
