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
    debtorChangedDetails,
  }: UpdateTransactionInvolvedAmount) {
    const receiver = await prisma.user.update({
      data: {
        wallet: receiverChangedDetails.wallet,
      },
      where: {
        id: receiverChangedDetails.id,
      },
    })

    const debtor = await prisma.user.update({
      data: {
        wallet: debtorChangedDetails.wallet,
      },
      where: {
        id: debtorChangedDetails.id,
      },
    })

    const transaction = await prisma.transaction.findFirst({
      where: {
        debtor,
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

  async findTransaction(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    })

    return transaction
  }

  async fetchCreditedTransactionsHistory(receiverId: string, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        receiver_id: receiverId,
      },
      skip: page - 0,
      take: 20,
    })

    return transactions
  }

  async fetchDebitedTransactionsHistory(debtorId: string, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        debtor_id: debtorId,
      },
      skip: page - 0,
      take: 20,
    })

    return transactions
  }

  async fetchAllTransactionsHistory(
    userId: Prisma.TransactionInclude,
    page: number,
  ) {
    const transactions = await prisma.transaction.findMany({
      include: {
        receiver: userId.receiver,
        debtor: userId.debtor,
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
