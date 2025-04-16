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

export function newLoginResponse(apiVersion: string, userData: LoginDataResponse): LoginResponse {
  return {
    apiVersion: apiVersion,
    data: userData,
  }
}
