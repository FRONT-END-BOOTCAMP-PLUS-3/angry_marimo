import { Marimo, PrismaClient, User } from "@prisma/client"
import { UserRepository } from "@marimo/domain/repositories"

export class PgUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
      return user ?? null
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      })
      return user ?? null
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findUsersWithoutId(
    id: number,
  ): Promise<(User & { marimos: Marimo[] })[] | null> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          NOT: { id },
        },
        include: {
          marimos: true,
        },
      })

      return users.length > 0 ? users : null
    } finally {
      await this.prisma.$disconnect()
    }
  }
}
