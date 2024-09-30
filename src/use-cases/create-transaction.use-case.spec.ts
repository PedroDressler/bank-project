import { it, describe, beforeEach, test, expect } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction.repository'
import { ValidateTransactionUseCase } from './validate-transaction.use-case'
import { CreateTransactionUseCase } from './create-transaction.use-case'
import { UpdateTransactionInvolvedWalletsPipe } from '@/pipes/update-transaction-involved-wallets.pipe'
import { hash } from 'bcrypt'
import { Prisma } from '@prisma/client'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

// #region Variables declaration
let userRepository: InMemoryUserRepository
let transactionRepository: InMemoryTransactionRepository
let validateTransactionUseCase: ValidateTransactionUseCase
let updateTransactionInvolvedWalletsPipe: UpdateTransactionInvolvedWalletsPipe
let sut: CreateTransactionUseCase
// #endregion

describe('Create Transaction Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    transactionRepository = new InMemoryTransactionRepository(userRepository)
    validateTransactionUseCase = new ValidateTransactionUseCase(
      transactionRepository,
    )
    updateTransactionInvolvedWalletsPipe =
      new UpdateTransactionInvolvedWalletsPipe(transactionRepository)
    sut = new CreateTransactionUseCase(
      transactionRepository,
      userRepository,
      validateTransactionUseCase,
      updateTransactionInvolvedWalletsPipe,
    )

    await userRepository.items.push({
      id: 'test-pedro',
      cpf: '000.000.000-00',
      email: 'pedro@email.com',
      hash_password: await hash('password123', 6),
      created_at: new Date(),
      updated_at: null,
      full_name: 'Pedro Ávila Dressler',
      username: 'khallzone',
      role: 'CUSTOMER',
      wallet: new Prisma.Decimal(500),
    })

    await userRepository.items.push({
      id: 'test-jdoe',
      role: 'CUSTOMER',
      email: 'jdoe@email.com',
      username: 'j.doe',
      full_name: 'John Doe',
      hash_password: await hash('password123', 6),
      cpf: '111.111.111-11',
      wallet: new Prisma.Decimal(1000),
      created_at: new Date(),
      updated_at: null,
    })
  })

  it('should create a transaction', async () => {
    const { transaction } = await sut.handle({
      amount: 200,
      debtor_id: 'test-pedro',
      receiver_id: 'test-jdoe',
      method: 'PIX',
    })

    expect(transaction.isTransactionAproved).toBe(true)
  })

  it("should not create a transaction if debtor doesn't have enough credit", async () => {
    expect(async () => {
      await sut.handle({
        amount: 600,
        debtor_id: 'test-pedro',
        receiver_id: 'test-jdoe',
        method: 'PIX',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not create a transaction if debtor is not found', async () => {
    expect(async () => {
      await sut.handle({
        amount: 600,
        debtor_id: 'test-ana',
        receiver_id: 'test-jdoe',
        method: 'PIX',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not create a transaction if receiver is not found', async () => {
    expect(async () => {
      await sut.handle({
        amount: 200,
        debtor_id: 'test-pedro',
        receiver_id: 'test-inexistent',
        method: 'PIX',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  test('if amount is correctly debited and credited', async () => {
    await sut.handle({
      amount: 500,
      debtor_id: 'test-pedro',
      receiver_id: 'test-jdoe',
      method: 'PIX',
    })

    const debitedUser = await userRepository.findUserById('test-pedro')
    const creditedUser = await userRepository.findUserById('test-jdoe')

    expect(Number(debitedUser?.wallet)).toBe(0)
    expect(Number(creditedUser?.wallet)).toBe(1500)
  })
})
