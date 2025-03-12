import { GuestBookRepository } from "@marimo/domain/repositories"
import { PrismaClient, GuestBook, User, Marimo } from "@prisma/client"

export class PgGuestBookRepository implements GuestBookRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    data: Omit<GuestBook, "id" | "createdAt" | "updatedAt">,
  ): Promise<GuestBook | null> {
    try {
      const newPost = await this.prisma.guestBook.create({
        data,
      })

      return newPost
    } catch (error) {
      console.error(error)
      throw new Error(`PgGuestBookRepository create error ----> ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async getAllPostByOwnerId(
    ownerId: number,
  ): Promise<(GuestBook & { guest: User & { marimos: Marimo[] } })[] | null> {
    try {
      const posts = await this.prisma.guestBook.findMany({
        where: { ownerId },
        include: {
          guest: {
            include: {
              marimos: {
                where: { status: { not: "dead" } },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return posts
    } catch (error) {
      console.error(error)
      throw new Error(
        `PgGuestBookRepository getAllPostByOwnerId error ----> ${error}`,
      )
    } finally {
      await this.prisma.$disconnect()
    }
  }
}
