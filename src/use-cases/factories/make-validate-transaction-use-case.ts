import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository'
import { ValidateTransactionUseCase } from '../validate-transaction.use-case'

export async function makeValidateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const validateTransactionUseCase = new ValidateTransactionUseCase(
    transactionRepository,
  )

  return validateTransactionUseCase
}
