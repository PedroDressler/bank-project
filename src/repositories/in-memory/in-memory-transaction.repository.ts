import { Prisma, Transaction } from '@prisma/client'
import {
  TransactionRepositories,
  UpdateTransactionInvolvedAmount,
} from '../transaction-repositories'
import { randomUUID } from 'node:crypto'
import { UserRepositories } from '../user-repositories'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

export class InMemoryTransactionRepository implements TransactionRepositories {
  public items: Transaction[] = []

  constructor(private userRepository: UserRepositories) {}

  async createTransaction({
    amount,
    method,
    debtor_id,
    receiver_id,
    id,
  }: Prisma.TransactionUncheckedCreateInput) {
    const transaction: Transaction = {
      amount: new Prisma.Decimal(amount.toString()),
      method,
      receiver_id,
      debtor_id,
      created_at: new Date(),
      id: id ?? randomUUID(),
      isTransactionAproved: false,
    }

    await this.items.push(transaction)

    return transaction
  }

  async findTransaction(transactionId: string) {
    const transaction = await this.items.find(
      (item) => item.id === transactionId,
    )

    return transaction ?? null
  }

  async fetchCreditedTransactionsHistory(
    receiverId: string,
    page: number,
  ): Promise<Transaction[]> {
    const transactions = await this.items
      .filter((item) => item.receiver_id === receiverId)
      .slice((page - 1) * 20, page * 20)

    return transactions
  }

  async fetchDebitedTransactionsHistory(
    debtorId: string,
    page: number,
  ): Promise<Transaction[]> {
    const transactions = await this.items
      .filter((item) => item.debtor_id === debtorId)
      .slice((page - 1) * 20, page * 20)

    return transactions
  }

  async fetchAllTransactionsHistory(
    userId: Prisma.TransactionInclude,
    page: number,
  ): Promise<Transaction[]> {
    const transactions = await this.items
      .filter(
        (item) => item.debtor_id === userId || item.receiver_id === userId,
      )
      .slice((page - 1) * 20, page * 20)

    return transactions
  }

  async updateTransactionInvolvedAmount(
    transactionId: string,
    {
      creditedUserDetails,
      debitedUserDetails,
    }: UpdateTransactionInvolvedAmount,
  ) {
    await this.userRepository.updateUserWallet(
      creditedUserDetails.id,
      creditedUserDetails.wallet,
    )

    await this.userRepository.updateUserWallet(
      debitedUserDetails.id,
      debitedUserDetails.wallet,
    )

    const transaction = await this.items.find(
      (item) => item.id === transactionId,
    )

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    return transaction
  }

  async validateTransaction(transactionId: string) {
    const transactionIndex = await this.items.findIndex(
      (item) => item.id === transactionId,
    )

    this.items[transactionIndex].isTransactionAproved = true

    const transaction = this.items[transactionIndex]

    return transaction ?? null
  }
}
