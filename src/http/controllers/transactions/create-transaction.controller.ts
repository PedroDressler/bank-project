import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateTransactionUseCase } from '../../use-cases/factories/make-create-transaction-use-case'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

export async function createTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTransactionBodySchema = z.object({
    debtor_id: z.string().uuid(),
    receiver_id: z.string().uuid(),
    amount: z.coerce.number().nonnegative(),
    method: z.enum(['PIX', 'CARD']),
  })

  const { debtor_id, receiver_id, amount, method } =
    createTransactionBodySchema.parse(request.body)

  const createTransactionUseCase = makeCreateTransactionUseCase()

  try {
    const { transaction } = await createTransactionUseCase.handle({
      receiver_id,
      debtor_id,
      amount,
      method,
    })

    return reply.code(201).send({ transaction })
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.code(404).send({ message: err.message })
    if (err instanceof UnauthorizedError)
      return reply.code(401).send({ message: err.message })
    throw err
  }
}
