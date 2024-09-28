import { Prisma } from '@prisma/client'
import { UserRepositories } from '../user-repositories'
import { prisma } from '../../app'

export class PrismaUserRepository implements UserRepositories {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findUserByCPF(cpf: string) {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    return user
  }

  async registerUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async updateUserRoleToOwner(userId: string) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: 'OWNER',
      },
    })

    return user
  }
}
