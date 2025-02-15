export interface UserDataResponse {
  id: string
  name: string
  email: string
}

export interface UserResponse {
  apiVersion: string
  data: UserDataResponse
}

export function newUserResponse(apiVersion: string, user: UserDataResponse): UserResponse {
  return {
    apiVersion: apiVersion,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

export interface LoginDataResponse {
  id: string
  name: string
  email: string
  token: string
}

export interface LoginResponse {
  apiVersion: string
  data: LoginDataResponse
}

export function newLoginResponse(apiVersion: string, user: LoginDataResponse): LoginResponse {
  return {
    apiVersion: apiVersion,
    data: user,
  }
}
