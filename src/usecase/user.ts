import type { LoginUser, GetUser, CreateUser } from '../entity/user'
import type { UserRepository } from '../adapter/gateway/user'
import jwt from 'jsonwebtoken'
import { comparePassword, hashPassword } from '../pkg/utils'

const JWT_SECRET = process.env.SECRET ?? 'secret'
const { sign } = jwt

export interface GetUserDto {
  id: string
  name: string
  email: string
}

export interface CreateUserInputDto {
  name: string
  email: string
  password: string
}

export interface LoginUserDto {
  id: string
  email: string
  name: string
  token: string
}

export interface LoginInputDto {
  email: string
  password: string
}
export interface UserUseCase {
  create(user: CreateUserInputDto): Promise<GetUserDto>
  getById(id: string): Promise<GetUserDto | null>
  getByEmail(email: string): Promise<GetUserDto | null>
  login(user: LoginInputDto): Promise<LoginUserDto | null>
}

export class UserUseCaseImpl implements UserUseCase {
  private readonly userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async create(user: CreateUserInputDto): Promise<GetUser> {
    const hashedPassword = await hashPassword(user.password)
    user.password = hashedPassword
    const existingUser = await this.userRepository.getByEmail(user.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }
    const createUser: CreateUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    }
    const createdUser = await this.userRepository.create(createUser)
    if (!createdUser) {
      throw new Error('User creation failed')
    }
    const userData: GetUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    }
    return userData
  }

  async getById(id: string): Promise<GetUser | null> {
    const user = await this.userRepository.getById(id)
    if (!user) {
      throw new Error('User not found')
    }
    const userData: GetUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }
    return userData
  }

  async getByEmail(email: string): Promise<GetUser | null> {
    const user = await this.userRepository.getByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }
    const userData: GetUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }
    return userData
  }

  async login(user: LoginInputDto): Promise<LoginUserDto | null> {
    const loginUser = await this.userRepository.getByEmail(user.email)
    if (!loginUser) {
      throw new Error('User not found')
    }
    const isPasswordValid = await comparePassword(user.password, loginUser.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const token = sign({ userId: loginUser.id }, JWT_SECRET, { expiresIn: '1h' })

    if (!token) {
      throw new Error('Token generation failed')
    }
    const userData: LoginUser = {
      id: loginUser.id,
      name: loginUser.name,
      email: loginUser.email,
      token,
    }
    return userData
  }
}
