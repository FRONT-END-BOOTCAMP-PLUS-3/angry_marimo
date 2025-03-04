import { User } from "@prisma/client"
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
}
