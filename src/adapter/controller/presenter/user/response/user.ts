export interface UserDataResponse {
  id: string
  name: string
  email: string
}

export interface UserResponse {
  apiVersion: string
  data: UserDataResponse
}

export function newUserResponse(apiVersion: string, userData: UserDataResponse): UserResponse {
  return {
    apiVersion: apiVersion,
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    },
  }
}
