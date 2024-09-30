import { Prisma, User } from '@prisma/client'

export interface UserRepositories {
  // @create
  registerUser(data: Prisma.UserCreateInput): Promise<User>

  // @search
  findUserById(userId: string): Promise<User | null>

  findUserByEmail(email: string): Promise<User | null>

  findUserByCPF(cpf: string): Promise<User | null>

  findUserByUserName(username: string): Promise<User | null>

  // @update
  updateUserRoleToOwner(userId: string): Promise<User>

  updateUserWallet(userId: string, amount: number): Promise<User>

  // @delete
}
