import { Transaction, User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
  TransactionRepositories,
  UpdateTransactionInvolvedAmountParams,
} from '../repositories/transaction-repositories'

interface UpdateTransactionInvolvedWalletsPipeRequest {
  amount: Decimal
  transactionId: string
  receiver: User | null
  debtor: User | null
}

interface UpdateTransactionInvolvedWalletsPipeResponse {
  transaction: Transaction
}

interface UpdateTransactionInvolvedAmountInterface {
  userWallet: Decimal
  transactionAmount: Decimal
}

export class UpdateTransactionInvolvedWalletsPipe {
  constructor(private transactionRepository: TransactionRepositories) {}

  async transform({
    amount,
    transactionId,
    receiver,
    debtor,
  }: UpdateTransactionInvolvedWalletsPipeRequest): Promise<UpdateTransactionInvolvedWalletsPipeResponse> {
    // #region Variables Definition
    let receiverWalletCalculated: number | null
    let debtorWalletCalculated: number | null
    const updateTransactionInvolvedAmountParams: UpdateTransactionInvolvedAmountParams =
      {
        transactionId,
        details: {
          creditedUserDetails: undefined,
          debitedUserDetails: undefined,
        },
      }
    // #endregion

    // calculate receiver wallet
    if (receiver) {
      receiverWalletCalculated = this.sumUpdateTransactionInvolvedAmount({
        transactionAmount: amount,
        userWallet: receiver.wallet,
      })

      // add receiver params
      updateTransactionInvolvedAmountParams.details.creditedUserDetails = {
        id: receiver.id,
        wallet: receiverWalletCalculated,
      }
    }

    // calculate debtor wallet
    if (debtor) {
      debtorWalletCalculated =
        this.subtractUpdateTransactionInvolvedAmountInterface({
          transactionAmount: amount,
          userWallet: debtor.wallet,
        })

      // add debtor params
      updateTransactionInvolvedAmountParams.details.debitedUserDetails = {
        id: debtor.id,
        wallet: debtorWalletCalculated,
      }
    }

    // query updated all wallet's values
    const transaction =
      await this.transactionRepository.updateTransactionInvolvedAmount(
        updateTransactionInvolvedAmountParams,
      )

    return { transaction }
  }

  private sumUpdateTransactionInvolvedAmount({
    transactionAmount,
    userWallet,
  }: UpdateTransactionInvolvedAmountInterface) {
    return Number(userWallet) + Number(transactionAmount)
  }

  private subtractUpdateTransactionInvolvedAmountInterface({
    transactionAmount,
    userWallet,
  }: UpdateTransactionInvolvedAmountInterface) {
    return Number(userWallet) - Number(transactionAmount)
  }
}
