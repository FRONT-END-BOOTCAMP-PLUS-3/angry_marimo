import { MarimoImage, PrismaClient } from "@prisma/client"
import { MarimoImageRepository } from "@marimo/domain/repositories"

export class PgMarimoImageRepository implements MarimoImageRepository {
  constructor(private prisma: PrismaClient) {}

  async findOneImageByMarimoId(marimoId: number): Promise<MarimoImage | null> {
    try {
      const image = await this.prisma.marimoImage.findFirst({
        where: {
          marimoId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return image
    } catch (error) {
      console.error(
        "Error PgMarimoImageRepository findOneImageByMarimoId:",
        error,
      )
      throw error
    }
  }

  async createImages(
    data: Omit<MarimoImage, "id" | "createdAt" | "updatedAt">,
  ): Promise<MarimoImage> {
    try {
      const newImage = await this.prisma.marimoImage.create({
        data,
      })

      return newImage
    } catch (error) {
      console.error("Error PgMarimoImageRepository createImages:", error)
      throw error
    }
  }
}
