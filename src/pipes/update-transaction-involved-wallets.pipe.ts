import { Transaction, User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionRepositories } from '../repositories/transaction-repositories'

interface UpdateTransactionInvolvedWalletsPipeRequest {
  amount: Decimal
  transactionId: string
  receiver: User
  debtor: User
}

interface UpdateTransactionInvolvedWalletsPipeResponse {
  transaction: Transaction
}

export class UpdateTransactionInvolvedWalletsPipe {
  constructor(private transactionRepository: TransactionRepositories) {}

  async transform({
    amount,
    transactionId,
    receiver,
    debtor,
  }: UpdateTransactionInvolvedWalletsPipeRequest): Promise<UpdateTransactionInvolvedWalletsPipeResponse> {
    // calculate receiver wallet
    const receiverWalletUpdated = Number(receiver.wallet) + Number(amount)

    // calculate debtor wallet
    const debtorWalletUpdated = Number(debtor.wallet) - Number(amount)

    // query updated all wallet's values
    const transaction =
      await this.transactionRepository.updateTransactionInvolvedAmount(
        transactionId,
        {
          creditedUserDetails: {
            id: receiver.id,
            wallet: receiverWalletUpdated,
          },
          debitedUserDetails: {
            id: debtor.id,
            wallet: debtorWalletUpdated,
          },
        },
      )

    return { transaction }
  }
}
