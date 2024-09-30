import { Prisma, User } from '@prisma/client'
import { UserRepositories } from '../user-repositories'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepositories {
  public items: User[] = []

  async registerUser({
    cpf,
    email,
    hash_password,
    username,
    full_name,
    id,
    role,
  }: Prisma.UserCreateInput) {
    const user: User = {
      id: id ?? randomUUID(),
      cpf,
      email,
      hash_password,
      created_at: new Date(),
      updated_at: null,
      full_name: full_name ?? null,
      username,
      role: role ?? 'CUSTOMER',
      wallet: new Prisma.Decimal(0),
    }

    await this.items.push(user)

    return user
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.items.find((item) => item.id === userId)

    return user ?? null
  }

  async findUserByEmail(email: string) {
    const user = await this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findUserByCPF(cpf: string) {
    const user = await this.items.find((item) => item.cpf === cpf)

    if (!user) {
      return null
    }

    return user
  }

  async findUserByUserName(username: string) {
    const user = await this.items.find((item) => item.username === username)

    if (!user) {
      return null
    }

    return user
  }

  async updateUserWallet(userId: string, amount: number) {
    const userIndex = await this.items.findIndex((item) => item.id === userId)

    this.items[userIndex].wallet = new Prisma.Decimal(amount)

    const user = this.items[userIndex]

    return user
  }

  async updateUserRoleToOwner(userId: string) {
    const userIndex = await this.items.findIndex((item) => item.id === userId)

    this.items[userIndex].role = 'OWNER'

    const user = this.items[userIndex]

    return user
  }
}
