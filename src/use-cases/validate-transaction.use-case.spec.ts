import { beforeEach, describe, expect, it } from 'vitest'
import { ValidateTransactionUseCase } from './validate-transaction.use-case'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction.repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user.repository'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: ValidateTransactionUseCase

describe('Validate Transaction Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    transactionRepository = new InMemoryTransactionRepository(userRepository)
    sut = new ValidateTransactionUseCase(transactionRepository)

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

  it('should validate a transaction', async () => {
    await transactionRepository.items.push({
      amount: new Prisma.Decimal(200),
      created_at: new Date(),
      debtor_id: 'test-pedro',
      receiver_id: 'test-jdoe',
      isTransactionAproved: false,
      id: 'test-transaction-one',
      method: 'PIX',
    })

    const { transaction } = await sut.handle({
      transactionId: 'test-transaction-one',
    })

    expect(transaction).toBeTruthy()
    expect(transaction.isTransactionAproved).toBe(true)
  })
})
