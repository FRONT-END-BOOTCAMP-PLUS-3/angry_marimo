import { PrismaClient, Marimo } from "@prisma/client"
import { MarimoRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/client"

const prisma = new PrismaClient()

export class PgMarimoRepository implements MarimoRepository {
  async findAliveMarimo(userId: number): Promise<Marimo | null> {
    try {
      const AliveMarimo = await prisma.marimo.findFirst({
        where: {
          userId: userId,
          status: {
            not: "dead",
          },
        },
        include: {
          object: true, // 관련된 object 정보도 함께 가져옵니다.
        },
      })
      return AliveMarimo
    } catch (error) {
      console.error("Error fetching alive marimos:", error)
      throw error
    }
  }

  async updateMarimo(
    id: number,
    marimoData: Omit<Marimo, "createdAt" | "updatedAt"> & {
      rect?: InputJsonValue
    },
  ) {
    try {
      const updatedMarimo = await prisma.marimo.update({
        where: { id: id },
        data: marimoData,
      })
      return updatedMarimo
    } catch (error) {
      console.error("Error updating marimo data:", error)
      throw error
    }
  }
  async createDefaultMarimo(defaultMarimo: {
    userId: number
    size: number
    rect: string
    color: string
    status: string
  }): Promise<Marimo> {
    try {
      const newMarimo = await prisma.marimo.create({
        data: defaultMarimo,
      })
      return newMarimo
    } catch (error) {
      console.error("Error creating default marimo:", error)
      throw error
    }
  }
}
