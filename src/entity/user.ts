export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface GetUser {
  id: string
  name: string
  email: string
}

export interface LoginUser {
  id: string
  email: string
  name: string
  token: string
}

export interface CreateUser {
  name: string
  email: string
  password: string
}
