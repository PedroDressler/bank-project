import { Prisma, Transaction } from '@prisma/client'
import { TransactionRepositories } from '../repositories/transaction-repositories'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ValidateTransactionUseCase } from '@/use-cases/validate-transaction.use-case'
import { UserRepositories } from '@/repositories/user-repositories'
import { UpdateTransactionInvolvedWalletsPipe } from '../pipes/update-transaction-involved-wallets.pipe'

interface CreateTransactionUseCaseRequest
  extends Prisma.TransactionUncheckedCreateInput {}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepositories,
    private userRepository: UserRepositories,
    private validateTransactionUseCase: ValidateTransactionUseCase,
    private updateTransactionInvolvedWalletsPipe: UpdateTransactionInvolvedWalletsPipe,
  ) {}

  async handle({
    amount,
    method,
    receiver_id,
    debtor_id,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    // check necessary rules
    const debtor = await this.userRepository.findUserById(debtor_id)

    if (!debtor) {
      throw new ResourceNotFoundError()
    }

    if (debtor.wallet < amount) {
      throw new UnauthorizedError()
    }

    const receiver = await this.userRepository.findUserById(receiver_id)

    if (!receiver) {
      throw new ResourceNotFoundError()
    }

    // create unvalidated transaction
    const unvalidatedTransaction =
      await this.transactionRepository.createTransaction({
        amount,
        method,
        debtor_id,
        receiver_id,
      })

    // transform users wallets from transaction context
    const { transaction: transformedTransaction } =
      await this.updateTransactionInvolvedWalletsPipe.transform({
        amount: unvalidatedTransaction.amount,
        transactionId: unvalidatedTransaction.id,
        debtor,
        receiver,
      })

    // validate the transaction
    const { transaction } = await this.validateTransactionUseCase.handle({
      transactionId: transformedTransaction.id,
    })

    return { transaction }
  }
}
