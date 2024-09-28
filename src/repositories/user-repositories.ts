import { Prisma, User } from '@prisma/client'

export interface UserRepositories {
  registerUser(data: Prisma.UserCreateInput): Promise<User>

  findUserByEmail(email: string): Promise<User | null>

  findUserByCPF(cpf: string): Promise<User | null>

  updateUserRoleToOwner(userId: string): Promise<User | null>

  getUserById(userId: string): Promise<User | null>
}
