import { Transaction } from '@prisma/client'
import { UseCase } from './interface'
import { TransactionRepositories } from '../repositories/transaction-repositories'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ValidateTransactionUseCaseRequest {
  calculatedTransaction: Transaction
}

interface ValidateTransactionUseCaseResponse {
  transaction: Transaction
}

export class ValidateTransactionUseCase
  implements
    UseCase<
      ValidateTransactionUseCaseRequest,
      ValidateTransactionUseCaseResponse
    >
{
  constructor(private transactionRepository: TransactionRepositories) {}

  async handle({
    calculatedTransaction,
  }: ValidateTransactionUseCaseRequest): Promise<ValidateTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.validateTransaction(
      calculatedTransaction.id,
    )

    if (!transaction) throw new ResourceNotFoundError()

    return { transaction }
  }
}
