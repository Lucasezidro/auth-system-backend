import { Prisma, User } from '@prisma/client'
import { UsersRepository } from './user-repository'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      username: data.username,
      email: data.email,
      password: data.password,
      street: data.street,
      addressNumber: data.addressNumber ?? '',
      neighborhood: data.neighborhood,
      complement: data.complement ?? '',
      city: data.city,
      state: data.state,
      card: data.card ?? 'DEBIT',
      cardNumber: data.cardNumber,
      expirationDate: data.expirationDate,
      securityCode: data.securityCode,
      responsibleName: data.responsibleName,
      installment: data.installment ?? '',
      createdAt: new Date(),
      updatedAt: new Date() ?? null,
    }

    this.items.push(user)

    return user
  }
}
