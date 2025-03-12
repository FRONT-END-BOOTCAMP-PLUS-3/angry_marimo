import { ObjectRepository } from "@marimo/domain/repositories/object-repository"

import { InputJsonValue } from "@prisma/client/runtime/client"
import { Object as ObjectItem, PrismaClient } from "@prisma/client"

export class PgObjectRepository implements ObjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<ObjectItem | null> {
    try {
      const findById = await this.prisma.object.findUnique({
        where: { id },
      })
      return findById || null
    } catch (error) {
      throw new Error(`PgObjectRepository.findId.error =========> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findAllByMarimoId(marimoId: number): Promise<ObjectItem[] | null> {
    try {
      const findByMarimoId = await this.prisma.object.findMany({
        where: { marimoId, isActive: true },
      })
      return findByMarimoId.length > 0 ? findByMarimoId : null
    } catch (error) {
      throw new Error(
        `PgObjectRepository.findAllByMarimoId.error =========> \n ${error}`,
      )
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async create(
    marimoId: number,
    type: string,
    rect: InputJsonValue,
    isActive: boolean,
    url: string,
    level: number,
  ): Promise<Omit<ObjectItem, "id">> {
    try {
      const createdObject = await this.prisma.object.create({
        data: {
          marimoId,
          type,
          rect,
          isActive,
          url,
          level,
        },
      })
      return createdObject
    } catch (error) {
      console.error("❌ Prisma create error:", error)
      throw new Error("Database insertion failed")
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async createAll(
    objects: {
      marimoId: number
      type: string
      rect: InputJsonValue
      isActive: boolean
      url: string
      level: number
    }[],
  ): Promise<void> {
    try {
      await this.prisma.object.createMany({
        data: objects,
      })
    } catch (error) {
      console.error("❌ Prisma 생성 error===> createMany:", error)
      throw new Error("Database insertion failed")
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async update(id: number): Promise<ObjectItem> {
    try {
      const updateObject = await this.prisma.object.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      })

      return updateObject
    } catch (error) {
      throw new Error(`PgObjectRepository.update.error =========> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }
}
