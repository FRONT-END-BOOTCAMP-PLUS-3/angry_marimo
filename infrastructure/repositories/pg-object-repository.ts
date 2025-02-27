import { ObjectRepository } from "@marimo/domain/repositories/object-repository"

import { InputJsonValue } from "@prisma/client/runtime/client"
import { Object as ObjectItem, PrismaClient } from "@prisma/client"

export class PgObjectRepository implements ObjectRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    id: number,
    marimoId: number,
    type: string,
    rect: InputJsonValue,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    url: string,
    level: number,
  ): Promise<ObjectItem | null> {
    try {
      const newObject = await this.prisma.object.create({
        data: {
          id,
          marimoId,
          type,
          rect,
          isActive,
          createdAt,
          updatedAt,
          level,
          url,
        },
      })
      return newObject || null
    } catch (error) {
      throw new Error(`PgObjectRepository.create.error =========> \n ${error}`)
    }
  }

  async update(
    id: number,
    isActive: boolean,
    updatedAt: Date,
  ): Promise<ObjectItem | null> {
    try {
      const updateObject = await this.prisma.object.update({
        where: { id },
        data: { isActive, updatedAt },
      })
      return updateObject || null
    } catch (error) {
      throw new Error(`PgObjectRepository.update.error =========> \n ${error}`)
    }
  }

  async findById(id: number): Promise<ObjectItem | null> {
    try {
      const findById = await this.prisma.object.findUnique({
        where: { id },
      })
      return findById || null
    } catch (error) {
      throw new Error(`PgObjectRepository.findId.error =========> \n ${error}`)
    }
  }

  async findAllByMarimoId(marimoId: number): Promise<ObjectItem[] | null> {
    try {
      const findByMarimoId = await this.prisma.object.findMany({
        where: { marimoId },
      })
      return findByMarimoId || null
    } catch (error) {
      throw new Error(
        `PgObjectRepository.findAllByMarimoId.error =========> \n ${error}`,
      )
    }
  }

  async deleteObject(id: number): Promise<void> {
    try {
      await this.prisma.object.delete({
        where: { id },
      })
    } catch (error) {
      throw new Error(
        `PgObjectRepository.deleteById.error =========> \n ${error}`,
      )
    }
  }
}
