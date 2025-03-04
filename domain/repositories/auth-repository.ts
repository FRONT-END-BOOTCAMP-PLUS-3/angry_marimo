import { User } from "@prisma/client"

export interface AuthRepository {
  signUp(email: string, password: string): Promise<User>
}
