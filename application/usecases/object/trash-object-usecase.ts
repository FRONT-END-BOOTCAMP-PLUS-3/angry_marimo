import { IObjectDto } from "./dto/object-dto"
import { ObjectRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/client"

export class TrashToObjectUseCase {
  constructor(private objectRepository: ObjectRepository) {}

  async execute(
    type: string,
    rect: InputJsonValue,
    isActive: boolean,
    url: string,
    level: number,
    marimoId: number,
  ): Promise<Omit<IObjectDto, "id" | "createdAt" | "updatedAt">> {
    try {
      if (!type || !marimoId) {
        console.error("Validation Error: Type and MarimoId are required.", {
          type,
          marimoId,
        })
        throw new Error("Invalid input: Type and MarimoId are required.")
      }
      if (!rect) {
        console.error("Validation Error: Rect data is missing or null.", {
          rect,
        })
        throw new Error("Invalid input: Rect data is missing or null.")
      }

      const objectItem = await this.objectRepository.create(
        marimoId,
        type,
        rect,
        isActive,
        url,
        level,
      )

      if (!objectItem) {
        throw new Error("Failed to create object from trash data")
      }

      return this.mapToObjectDto(objectItem, marimoId)
    } catch (error) {
      throw new Error(`TrashToObjectUseCase.execute error: ${error}`)
    }
  }

  private mapToObjectDto(
    objectItem: IObjectDto,
    marimoId: number,
  ): Omit<IObjectDto, "id" | "createdAt" | "updatedAt"> {
    if (!objectItem) {
      throw new Error("Invalid object: received null")
    }
    return {
      ...objectItem,
      marimoId: marimoId,
    }
  }
}
