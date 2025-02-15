import { Context } from 'hono'
import { UserUseCase } from '../../../usecase/user'
import { apiVersion } from '../../../api/constants'
import { newLoginResponse, newUserResponse } from '../presenter/user/response/user'
import { CreateUserRequest, LoginRequest } from '../presenter/user/request/user-request'
// import { log } from '../../../logger';

export class UserHandler {
  private userUseCase: UserUseCase

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase
  }

  async createUser(c: Context, user: CreateUserRequest) {
    try {
      const createdUser = await this.userUseCase.create(user)
      return c.json(newUserResponse(apiVersion, createdUser), 201)
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
      return c.json(newUserResponse(apiVersion, user), 201)
    } catch (err: any) {
      // log.error(err.message)
      return c.json({ error: err.message }, 400)
    }
  }

  async loginUser(c: Context, loginUser: LoginRequest) {
    try {
      const user = await this.userUseCase.login(loginUser.email, loginUser.password)
      if (!user) {
        return c.json({ error: 'Invalid email or password' }, 401)
      }

      return c.json(newLoginResponse(apiVersion, user), 201)
    } catch (err: any) {
      // log.error(err.message)
      return c.json({ error: err.message }, 400)
    }
  }
}
