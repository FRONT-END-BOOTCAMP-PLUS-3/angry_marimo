import { Marimo, User } from "@prisma/client"
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
  findUsersWithoutId(
    id: number,
  ): Promise<(User & { marimos: Marimo[] })[] | null>
}
