import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { RegisterUseCase } from '../register.use-case'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository()
  const useCase = new RegisterUseCase(userRepository)

  return useCase
}
