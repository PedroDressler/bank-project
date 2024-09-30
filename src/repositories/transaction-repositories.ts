import { Prisma, Transaction } from '@prisma/client'

type UpdateTransactionInvolvedAmountType = {
  id: string
  wallet: number
}

interface UpdateTransactionInvolvedAmountInterface {
  creditedUserDetails?: UpdateTransactionInvolvedAmountType
  debitedUserDetails?: UpdateTransactionInvolvedAmountType
}

export interface UpdateTransactionInvolvedAmountParams {
  transactionId: string
  details: UpdateTransactionInvolvedAmountInterface
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
  updateTransactionInvolvedAmount({
    transactionId,
    details: { creditedUserDetails, debitedUserDetails },
  }: UpdateTransactionInvolvedAmountParams): Promise<Transaction>

  validateTransaction(transactionId: string): Promise<Transaction>
}
