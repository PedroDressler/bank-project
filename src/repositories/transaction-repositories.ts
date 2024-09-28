import { Prisma, Transaction } from '@prisma/client'

export type UpdateTransactionInvolvedAmountType = {
  id: string
  wallet: number
}

export interface UpdateTransactionInvolvedAmount {
  receiverChangedDetails: UpdateTransactionInvolvedAmountType
  senderChangedDetails: UpdateTransactionInvolvedAmountType
}

export interface TransactionRepositories {
  createTransaction(data: Prisma.TransactionCreateInput): Promise<Transaction>

  getTransaction(transactionId: string): Promise<Transaction | null>

  fetchReceivedTransactionsByUser(
    receiverId: string,
    page: number,
  ): Promise<Transaction[]>

  fetchSentTransactionsByUser(
    senderId: string,
    page: number,
  ): Promise<Transaction[]>

  fetchTransactionHistory(
    userId: Prisma.TransactionInclude,
    page: number,
  ): Promise<Transaction[]>

  updateTransactionInvolvedAmount(
    details: UpdateTransactionInvolvedAmount,
  ): Promise<Transaction | null>

  validateTransaction(transactionId: string): Promise<Transaction | null>
}
