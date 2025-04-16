import { z } from 'zod'

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }),
  email: z
    .string({
      invalid_type_error: 'Please enter an email.',
    })
    .email(),
  password: z
    .string({
      invalid_type_error: 'Please enter a password.',
    })
    .min(6),
})

export const createUserRequest = FormSchema.omit({ id: true })
export const loginRequest = FormSchema.omit({ id: true, name: true })


export interface LoginRequest {
  email: string
  password: string
}

export function newLoginRequest(data: LoginRequest): LoginRequest {
  return {
    email: data.email,
    password: data.password,
  }
}
