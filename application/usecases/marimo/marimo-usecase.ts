import { getTrashImage } from "@marimo/public/utils/level-image"
import { randomLocation } from "@marimo/public/utils/random-location"

import { PrismaClient, Marimo } from "@prisma/client"
import { InputJsonValue } from "@prisma/client/runtime/client"
import { MarimoRepository, ObjectRepository } from "@marimo/domain/repositories"

export class MarimoUsecase {
  private prisma: PrismaClient

  constructor(
    private marimoRepository: MarimoRepository,
    private objectRepository: ObjectRepository,
  ) {
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

  async createDefaultMarimo(userId: number): Promise<Marimo> {
    const defaultMarimo = {
      name: "marimo",
      userId: userId,
      size: 5,
      rect: JSON.stringify({ x: 50, y: 50 }),
      color: "#89a45f",
      status: "angry",
    }

    return this.marimoRepository.createDefaultMarimo(defaultMarimo)
  }

  async updateMarimo(marimoData: Marimo) {
    const { id, userId, name, size, rect, color, src, status } = marimoData

    const newMarimo = await this.marimoRepository.updateMarimo(id, {
      id,
      userId,
      name,
      src,
      size,
      rect,
      color,
      status,
    })

    if (!newMarimo) throw new Error("마리모 생성 실패")

    const points = randomLocation(5)

    const newTrashItems = points.map((point) => {
      const level = Math.floor(Math.random() * 3) + 1

      return {
        marimoId: newMarimo.id,
        level,
        url: getTrashImage(level),
        rect: {
          x: point.x * 70,
          y: point.y * 70,
        },
        isActive: true,
        type: "trash",
      }
    }) as {
      marimoId: number
      type: string
      rect: InputJsonValue
      isActive: boolean
      url: string
      level: number
    }[]

    const trashItems = await this.objectRepository.createAll(newTrashItems)

    return {
      ...newMarimo,
      objects: trashItems,
    }
  }
}
