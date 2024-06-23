import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    zipCode: z.string(),
    street: z.string(),
    addressNumber: z.string(),
    neighborhood: z.string(),
    complement: z.string(),
    city: z.string(),
    cardNumber: z.string(),
    expirationDate: z.string(),
    securityCode: z.string(),
    responsibleName: z.string(),
    installment: z.string(),
    state: z.string(),
    card: z.enum(['CREDIT', 'DEBIT']).default('DEBIT'),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().optional(),
  })

  const dataUser = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      username: dataUser.username,
      email: dataUser.email,
      password: dataUser.password,
      zipCode: dataUser.zipCode,
      street: dataUser.street,
      addressNumber: dataUser.addressNumber,
      neighborhood: dataUser.neighborhood,
      complement: dataUser.complement ?? '',
      city: dataUser.city,
      cardNumber: dataUser.cardNumber,
      expirationDate: dataUser.expirationDate,
      securityCode: dataUser.securityCode,
      responsibleName: dataUser.responsibleName,
      installment: dataUser.installment ?? '',
      state: dataUser.state,
      card: dataUser.card,
      createdAt: new Date(),
      updatedAt: dataUser.updatedAt ?? null,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
