import { PrismaClient, User } from "@prisma/client"
import { UserRepository } from "@marimo/domain/repositories"

export class PgUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prisma = new PrismaClient()
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      return user ?? null
    } finally {
      await prisma.$disconnect()
    }
  }

  async findById(id: number): Promise<User | null> {
    const prisma = new PrismaClient()
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })
      return user ?? null
    } finally {
      await prisma.$disconnect()
    }
  }
}
