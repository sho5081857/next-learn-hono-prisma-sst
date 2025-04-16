import type { PrismaClient } from '@prisma/client'
import type { CreateUser, GetUser, User } from '../../entity/user'

export interface UserRepository {
  create(user: CreateUser): Promise<GetUser>
  getById(id: string): Promise<GetUser | null>
  getByEmail(email: string): Promise<User | null>
}

export class UserRepositoryImpl implements UserRepository {
  private readonly prisma: PrismaClient
  constructor(prime: PrismaClient) {
    this.prisma = prime
  }

  async create(user: CreateUser): Promise<GetUser> {
    const createdUser = await this.prisma.users.create({
      data: user,
    })

    return createdUser
  }

  async getById(id: string): Promise<GetUser | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    })

    return user
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    })

    return user
  }
}
