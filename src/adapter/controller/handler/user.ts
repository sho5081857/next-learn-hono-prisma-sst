import type { Context } from 'hono'
import type { CreateUserInputDto, LoginInputDto, UserUseCase } from '../../../usecase/user'
import { apiVersion } from '../../../api/constants'
import type { CreateUserRequest } from '../presenter/user/request/createUser'
import type { LoginRequest } from '../presenter/user/request/login'
import { newUserResponse, type UserDataResponse } from '../presenter/user/response/user'
import { type LoginDataResponse, newLoginResponse } from '../presenter/user/response/login'
// import { log } from '../../../logger';

export class UserHandler {
  private readonly userUseCase: UserUseCase
  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase
  }

  async createUser(c: Context, req: CreateUserRequest) {
    try {
      const user: CreateUserInputDto = {
        email: req.email,
        password: req.password,
        name: req.name,
      }
      const createdUser = await this.userUseCase.create(user)
      if (!createdUser) {
        return c.json({ error: 'User creation failed' }, 400)
      }
      const userData: UserDataResponse = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      }
      return c.json(newUserResponse(apiVersion, userData), 201)
    } catch (err: any) {
      // log.error(err.message)
      return c.json({ error: err.message }, 400)
    }
  }

  async getUserById(c: Context) {
    const id = c.req.param('id')
    try {
      const user = await this.userUseCase.getById(id)
      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }
      const userData: UserDataResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
      }
      return c.json(newUserResponse(apiVersion, userData), 201)
    } catch (err: any) {
      // log.error(err.message)
      return c.json({ error: err.message }, 400)
    }
  }

  async loginUser(c: Context, req: LoginRequest) {
    try {
      const user: LoginInputDto = {
        email: req.email,
        password: req.password,
      }
      const loginUser = await this.userUseCase.login(user)
      if (!loginUser) {
        return c.json({ error: 'Invalid email or password' }, 401)
      }
      const loginUserData: LoginDataResponse = {
        id: loginUser.id,
        name: loginUser.name,
        email: loginUser.email,
        token: loginUser.token,
      }
      return c.json(newLoginResponse(apiVersion, loginUserData), 201)
    } catch (err: any) {
      // log.error(err.message)
      return c.json({ error: err.message }, 400)
    }
  }
}
