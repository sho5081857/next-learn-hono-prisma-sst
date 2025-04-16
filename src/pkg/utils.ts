import { genSalt, hash, compare } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10)
  return hash(password, salt)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}
