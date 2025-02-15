import { LoginUser, GetUser, comparePassword, hashPassword } from '../entity/user'
import { UserRepository } from '../adapter/gateway/user'
import { sign } from 'jsonwebtoken'
import { CreateUserRequest } from '../adapter/controller/presenter/user/request/user-request'

const JWT_SECRET = process.env.SECRET ?? 'secret'

export interface UserUseCase {
  create(user: CreateUserRequest): Promise<GetUser>
  getById(id: string): Promise<GetUser | null>
  getByEmail(email: string): Promise<GetUser | null>
  login(email: string, password: string): Promise<LoginUser | null>
}

export class UserUseCaseImpl implements UserUseCase {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async create(user: CreateUserRequest): Promise<GetUser> {
    const hashedPassword = await hashPassword(user.password)
    user.password = hashedPassword
    return this.userRepository.create(user)
  }

  async getById(id: string): Promise<GetUser | null> {
    return this.userRepository.getById(id)
  }

  async getByEmail(email: string): Promise<GetUser | null> {
    return this.userRepository.getByEmail(email)
  }

  async login(email: string, password: string): Promise<LoginUser | null> {
    const user = await this.userRepository.getByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    return {
      ...user,
      token,
    }
  }
}
