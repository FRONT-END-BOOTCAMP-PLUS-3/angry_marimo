import { PrismaClient, GuestBook } from "@prisma/client"
import { GuestBookRepository } from "@marimo/domain/repositories"

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

  async getAllPostByOwnerId(ownerId: number): Promise<GuestBook[] | null> {
    try {
      const posts = await this.prisma.guestBook.findMany({
        where: { ownerId },
        include: {
          guest: true,
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
