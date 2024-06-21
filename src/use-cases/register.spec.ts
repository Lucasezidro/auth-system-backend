import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory-user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      username: 'Lucas Ezidro',
      email: 'lucasezidro7@gmail.com',
      password: '123456',
      street: 'Rua teste',
      addressNumber: '40',
      neighborhood: 'vila teste',
      complement: 'apto 4',
      city: 'cidade teste',
      state: 'estado teste',
      card: 'DEBIT',
      cardNumber: '1234567890',
      expirationDate: '2024-06-06T00:00.000z',
      securityCode: '123',
      responsibleName: 'Lucas Ezidro',
      installment: '12',
      createdAt: new Date(),
      updatedAt: null,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      username: 'Lucas Ezidro',
      email: 'lucasezidro7@gmail.com',
      password: '123456',
      street: 'Rua teste',
      addressNumber: '40',
      neighborhood: 'vila teste',
      complement: 'apto 4',
      city: 'cidade teste',
      state: 'estado teste',
      card: 'DEBIT',
      cardNumber: '1234567890',
      expirationDate: '2024-06-06T00:00.000z',
      securityCode: '123',
      responsibleName: 'Lucas Ezidro',
      installment: '12',
      createdAt: new Date(),
      updatedAt: null,
    })

    const isPasswordCorrectlyHashes = await compare('123456', user.password)

    expect(isPasswordCorrectlyHashes).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johndoe@exemple.com'

    await registerUseCase.execute({
      username: 'Lucas Ezidro',
      email,
      password: '123456',
      street: 'Rua teste',
      addressNumber: '40',
      neighborhood: 'vila teste',
      complement: 'apto 4',
      city: 'cidade teste',
      state: 'estado teste',
      card: 'DEBIT',
      cardNumber: '1234567890',
      expirationDate: '2024-06-06T00:00.000z',
      securityCode: '123',
      responsibleName: 'Lucas Ezidro',
      installment: '12',
      createdAt: new Date(),
      updatedAt: null,
    })

    await expect(() =>
      registerUseCase.execute({
        username: 'Lucas Ezidro',
        email,
        password: '123456',
        street: 'Rua teste',
        addressNumber: '40',
        neighborhood: 'vila teste',
        complement: 'apto 4',
        city: 'cidade teste',
        state: 'estado teste',
        card: 'DEBIT',
        cardNumber: '1234567890',
        expirationDate: '2024-06-06T00:00.000z',
        securityCode: '123',
        responsibleName: 'Lucas Ezidro',
        installment: '12',
        createdAt: new Date(),
        updatedAt: null,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
