import { PrismaClient, Marimo } from "@prisma/client"
import { MarimoRepository } from "@marimo/domain/repositories"

export class MarimoUsecase {
  private prisma: PrismaClient

  constructor(private marimoRepository: MarimoRepository) {
    this.prisma = new PrismaClient()
  }

  async ensureAliveMarimo(userId: number): Promise<Marimo | null> {
    try {
      const aliveMairmo = await this.marimoRepository.findAliveMarimo(userId)

      // Check if all marimos are "dead"
      if (aliveMairmo === null) {
        // Create a default Marimo if all are dead
        return await this.createDefaultMarimo(userId)
      }

      return aliveMairmo
    } catch (error) {
      console.error("Error ensuring Alive Marimo:", error)
      throw error
    }
  }

  private async createDefaultMarimo(userId: number): Promise<Marimo> {
    const defaultMarimo = {
      name: "marimo",
      userId: userId,
      size: 80,
      rect: JSON.stringify({ x: 50, y: 50 }),
      color: "#89a45f", // Default color
      status: "angry", // Default status
    }

    return this.marimoRepository.createDefaultMarimo(defaultMarimo)

    // return this.prisma.marimo.create({
    //   data: defaultMarimo,
    // })
  }

  async updateMarimo(marimoData: Marimo) {
    const { id, userId, name, size, rect, color, src, status } = marimoData

    return this.marimoRepository.updateMarimo(id, {
      id,
      userId,
      name,
      src,
      size,
      rect,
      color,
      status,
    })
  }
}
