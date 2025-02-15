import * as bcrypt from "bcryptjs";

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

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
