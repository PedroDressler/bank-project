import { Transaction } from '@prisma/client'
import { TransactionRepositories } from '../repositories/transaction-repositories'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ValidateTransactionUseCaseRequest {
  transactionId: string
}

interface ValidateTransactionUseCaseResponse {
  transaction: Transaction
}

export class ValidateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepositories) {}

  async handle({
    transactionId,
  }: ValidateTransactionUseCaseRequest): Promise<ValidateTransactionUseCaseResponse> {
    const transaction =
      await this.transactionRepository.validateTransaction(transactionId)

    if (!transaction) throw new ResourceNotFoundError()

    return { transaction }
  }
}
