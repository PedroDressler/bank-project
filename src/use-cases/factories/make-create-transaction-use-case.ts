import { UpdateTransactionInvolvedWalletsPipe } from '../../pipes/update-transaction-involved-wallets.pipe'
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { CreateTransactionUserCase } from '../create-transaction.use-case'
import { ValidateTransactionUseCase } from '../validate-transaction.use-case'

export function makeCreateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()
  const validateTransactionUseCase = new ValidateTransactionUseCase(
    transactionRepository,
  )
  const updateTransactionInvolvedWalletsPipe =
    new UpdateTransactionInvolvedWalletsPipe(transactionRepository)
  const useCase = new CreateTransactionUserCase(
    transactionRepository,
    userRepository,
    validateTransactionUseCase,
    updateTransactionInvolvedWalletsPipe,
  )

  return useCase
}
