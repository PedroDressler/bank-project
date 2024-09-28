import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateTransactionUseCase } from '../../use-cases/factories/make-create-transaction-use-case'

export async function createTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTransactionBodySchema = z.object({
    sender_id: z.string().uuid(),
    receiver_id: z.string().uuid(),
    amount: z.coerce.number().nonnegative(),
    method: z.enum(['PIX', 'CARD']),
  })

  const { sender_id, receiver_id, amount, method } =
    createTransactionBodySchema.parse(request.body)

  const createTransactionUseCase = makeCreateTransactionUseCase()

  const { transaction } = await createTransactionUseCase.handle({
    receiver_id,
    sender_id,
    amount,
    method,
  })

  return reply.code(201).send({ transaction })
}
