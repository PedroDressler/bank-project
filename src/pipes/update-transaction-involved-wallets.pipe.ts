import { Transaction, User } from '@prisma/client'
import { UseCase } from '../use-cases/interface'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionRepositories } from '../repositories/transaction-repositories'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateTransactionInvolvedWalletsPipeRequest {
  amount: Decimal
  receiver: User
  sender: User
}

interface UpdateTransactionInvolvedWalletsPipeResponse {
  calculatedTransaction: Transaction
}

export class UpdateTransactionInvolvedWalletsPipe
  implements
    UseCase<
      UpdateTransactionInvolvedWalletsPipeRequest,
      UpdateTransactionInvolvedWalletsPipeResponse
    >
{
  constructor(private transactionRepository: TransactionRepositories) {}

  async handle({
    amount,
    receiver,
    sender,
  }: UpdateTransactionInvolvedWalletsPipeRequest): Promise<UpdateTransactionInvolvedWalletsPipeResponse> {
    // calculate receiver wallet
    const receiverWalletUpdated = Number(receiver.wallet) + Number(amount)

    // calculate sender wallet
    const senderWalletUpdated = Number(sender.wallet) - Number(amount)

    // query updated all wallet's values
    const calculatedTransaction =
      await this.transactionRepository.updateTransactionInvolvedAmount({
        receiverChangedDetails: {
          id: receiver.id,
          wallet: receiverWalletUpdated,
        },
        senderChangedDetails: {
          id: sender.id,
          wallet: senderWalletUpdated,
        },
      })

    if (!calculatedTransaction) throw new ResourceNotFoundError()

    return { calculatedTransaction }
  }
}
