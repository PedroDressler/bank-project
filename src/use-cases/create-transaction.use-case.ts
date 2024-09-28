import { Prisma, Transaction } from '@prisma/client'
import { UseCase } from './interface'
import { TransactionRepositories } from '../repositories/transaction-repositories'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { ValidateTransactionUseCase } from './validate-transaction.use-case'
import { UserRepositories } from '../repositories/user-repositories'
import { UpdateTransactionInvolvedWalletsPipe } from '../pipes/update-transaction-involved-wallets.pipe'

interface CreateTransactionUserCaseRequest
  extends Prisma.TransactionUncheckedCreateInput {}

interface CreateTransactionUserCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUserCase
  implements
    UseCase<
      CreateTransactionUserCaseRequest,
      CreateTransactionUserCaseResponse
    >
{
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
    sender_id,
  }: CreateTransactionUserCaseRequest): Promise<CreateTransactionUserCaseResponse> {
    // check necessary rules
    const sender = await this.userRepository.getUserById(sender_id)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    if (sender.wallet < amount) {
      throw new UnauthorizedError()
    }

    const receiver = await this.userRepository.getUserById(receiver_id)

    if (!receiver) {
      throw new ResourceNotFoundError()
    }

    // create unvalidated transaction
    const unvalidatedTransaction =
      await this.transactionRepository.createTransaction({
        amount,
        method,
        sender: {
          connect: sender,
        },
        receiver: {
          connect: receiver,
        },
      })

    // transform users wallets from transaction context
    const { calculatedTransaction } =
      await this.updateTransactionInvolvedWalletsPipe.handle({
        amount: unvalidatedTransaction.amount,
        sender,
        receiver,
      })

    const { transaction } = await this.validateTransactionUseCase.handle({
      calculatedTransaction,
    })

    return { transaction }
  }
}
