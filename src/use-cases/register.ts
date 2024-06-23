import { UsersRepository } from '@/repositories/user-repository'
import { $Enums, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  username: string
  email: string
  password: string
  zipCode: string
  street: string
  addressNumber: string
  neighborhood: string
  complement?: string
  city: string
  state: string
  card: $Enums.CardType
  cardNumber: string
  expirationDate: string
  securityCode: string
  responsibleName: string
  installment?: string
  createdAt: Date
  updatedAt: Date | null
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    props: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const userPassword = await hash(props.password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(
      props.email,
    )

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      username: props.username,
      email: props.email,
      password: userPassword,
      zipCode: props.zipCode,
      street: props.street,
      addressNumber: props.addressNumber,
      neighborhood: props.neighborhood,
      complement: props.complement,
      city: props.city,
      cardNumber: props.cardNumber,
      expirationDate: props.expirationDate,
      securityCode: props.securityCode,
      responsibleName: props.responsibleName,
      installment: props.installment,
      state: props.state,
      card: props.card,
    })

    return {
      user,
    }
  }
}
