import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case'
import { ResourceAlreadyExistsError } from '../../errors/resource-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    username: z.string(),
    full_name: z.string(),
    email: z.string().email(),
    cpf: z.string(),
    password: z.string(),
  })

  const { email, full_name, password, username, cpf } =
    registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { user } = await registerUseCase.handle({
      cpf,
      email,
      full_name,
      password,
      username,
    })

    return reply.code(201).send({ user })
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return reply.code(400).send()
    }
    throw err
  }
}
