import { it, describe, beforeEach, expect } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository'
import { RegisterUseCase } from './register.use-case'
import { compare } from 'bcrypt'
import { ResourceAlreadyExistsError } from '@/errors/resource-already-exists-error'

let userRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should register a user', async () => {
    const { user } = await sut.handle({
      email: 'pedro@email.com',
      cpf: '000.000.000-00',
      full_name: 'Pedro Ávila Dressler',
      password: 'password123',
      username: 'khallzone',
    })

    expect(user.cpf).toBe('000.000.000-00')
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash password correctly', async () => {
    const { user } = await sut.handle({
      email: 'pedro@email.com',
      cpf: '000.000.000-00',
      full_name: 'Pedro Ávila Dressler',
      password: 'password123',
      username: 'khallzone',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      user.hash_password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not register a user if user with same email already exists', async () => {
    await sut.handle({
      email: 'pedro@email.com',
      cpf: '000.000.000-00',
      full_name: 'Pedro Ávila Dressler',
      password: 'password123',
      username: 'khallzone',
    })

    expect(async () => {
      await sut.handle({
        email: 'pedro@email.com',
        cpf: '999.999.999-99',
        full_name: 'JohnDoe',
        password: 'password321',
        username: 'John D Oe',
      })
    }).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not register a user if user with same cpf already exists', async () => {
    await sut.handle({
      email: 'pedro@email.com',
      cpf: '000.000.000-00',
      full_name: 'Pedro Ávila Dressler',
      password: 'password123',
      username: 'khallzone',
    })

    expect(async () => {
      await sut.handle({
        email: 'jdoe@email.com',
        cpf: '000.000.000-00',
        full_name: 'JohnDoe',
        password: 'password321',
        username: 'John D Oe',
      })
    }).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not register a user if user with same username already exists', async () => {
    await sut.handle({
      email: 'pedro@email.com',
      cpf: '000.000.000-00',
      full_name: 'Pedro Ávila Dressler',
      password: 'password123',
      username: 'khallzone',
    })

    expect(async () => {
      await sut.handle({
        email: 'jdoe@email.com',
        cpf: '999.999.999-99',
        full_name: 'JohnDoe',
        password: 'password321',
        username: 'khallzone',
      })
    }).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
