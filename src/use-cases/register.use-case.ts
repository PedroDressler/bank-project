import { User } from '@prisma/client'
import { UseCase } from './interface'
import { UserRepositories } from '../repositories/user-repositories'
import { hash } from 'bcrypt'
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error'

interface RegisterUseCaseRequest {
  cpf: string
  email: string
  password: string
  username: string
  full_name: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase
  implements UseCase<RegisterUseCaseRequest, RegisterUseCaseResponse>
{
  constructor(private userRepository: UserRepositories) {}

  async handle({
    cpf,
    email,
    password,
    username,
    full_name,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findUserByEmail(email)

    if (userWithSameEmail) {
      throw new ResourceAlreadyExistsError()
    }

    const userWithSameCPF = await this.userRepository.findUserByCPF(cpf)

    if (userWithSameCPF) {
      throw new ResourceAlreadyExistsError()
    }

    const user = await this.userRepository.registerUser({
      cpf,
      email,
      hash_password: await hash(password, 6),
      username,
      full_name,
      wallet: 1000.0,
    })

    return { user }
  }
}
