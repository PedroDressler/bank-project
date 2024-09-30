import { Prisma, Transaction } from '@prisma/client'

type UpdateTransactionInvolvedAmountType = {
  id: string
  wallet: number
}

export interface UpdateTransactionInvolvedAmount {
  creditedUserDetails: UpdateTransactionInvolvedAmountType
  debitedUserDetails: UpdateTransactionInvolvedAmountType
}

export interface TransactionRepositories {
  // @create
  createTransaction(
    data: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction>

  // @search
  findTransaction(transactionId: string): Promise<Transaction | null>

  fetchCreditedTransactionsHistory(
    receiverId: string,
    page: number,
  ): Promise<Transaction[]>

  fetchDebitedTransactionsHistory(
    debtorId: string,
    page: number,
  ): Promise<Transaction[]>

  fetchAllTransactionsHistory(
    userId: Prisma.TransactionInclude,
    page: number,
  ): Promise<Transaction[]>

  // @update
  updateTransactionInvolvedAmount(
    transactionId: string,
    details: {
      creditedUserDetails: UpdateTransactionInvolvedAmountType
      debitedUserDetails: UpdateTransactionInvolvedAmountType
    },
  ): Promise<Transaction>

  validateTransaction(transactionId: string): Promise<Transaction>
}
