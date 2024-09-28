import { Prisma } from '@prisma/client'
import {
  TransactionRepositories,
  UpdateTransactionInvolvedAmount,
} from '../transaction-repositories'
import { prisma } from '../../app'

export class PrismaTransactionRepository implements TransactionRepositories {
  async validateTransaction(transactionId: string) {
    const transaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        isTransactionAproved: true,
      },
    })

    return transaction
  }

  async updateTransactionInvolvedAmount({
    receiverChangedDetails,
    senderChangedDetails,
  }: UpdateTransactionInvolvedAmount) {
    const receiver = await prisma.user.update({
      data: {
        wallet: receiverChangedDetails.wallet,
      },
      where: {
        id: receiverChangedDetails.id,
      },
    })

    const sender = await prisma.user.update({
      data: {
        wallet: senderChangedDetails.wallet,
      },
      where: {
        id: senderChangedDetails.id,
      },
    })

    const transaction = await prisma.transaction.findFirst({
      where: {
        sender,
        receiver,
        isTransactionAproved: false,
      },
    })

    return transaction
  }

  async createTransaction(data: Prisma.TransactionCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
  }

  async getTransaction(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    })

    return transaction
  }

  async fetchReceivedTransactionsByUser(receiverId: string, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        receiver_id: receiverId,
      },
      skip: page - 0,
      take: 20,
    })

    return transactions
  }

  async fetchSentTransactionsByUser(senderId: string, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        sender_id: senderId,
      },
      skip: page - 0,
      take: 20,
    })

    return transactions
  }

  async fetchTransactionHistory(
    userId: Prisma.TransactionInclude,
    page: number,
  ) {
    const transactions = await prisma.transaction.findMany({
      include: {
        receiver: userId.receiver,
        sender: userId.sender,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: page - 0,
      take: 20,
    })

    return transactions
  }
}
