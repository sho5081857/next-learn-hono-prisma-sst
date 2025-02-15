import { PrismaClient } from '@prisma/client'
import { CreateUserRequest } from '../controller/presenter/user/request/user-request'
import { GetUser, User } from '../../entity/user'

export interface UserRepository {
  create(user: CreateUserRequest): Promise<GetUser>
  getById(id: string): Promise<GetUser | null>
  getByEmail(email: string): Promise<User | null>
}

export class UserRepositoryImpl implements UserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(user: CreateUserRequest): Promise<GetUser> {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      throw new Error('Email already exists')
    }

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
