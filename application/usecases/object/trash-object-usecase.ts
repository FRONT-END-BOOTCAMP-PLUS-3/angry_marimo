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

      console.log("Creating object with data:", {
        type,
        rect,
        isActive,
        url,
        level,
        marimoId,
      })
      const objectItem = await this.objectRepository.create(
        marimoId,
        type,
        rect,
        isActive,
        url,
        level,
      )

      if (!objectItem) {
        console.error(
          "Creation Error: Failed to create object from trash data.",
          { marimoId, type, rect, isActive, url, level },
        )
        throw new Error("Failed to create object from trash data")
      }

      console.log("Object created successfully:", objectItem)
      return this.mapToObjectDto(objectItem, marimoId)
    } catch (error) {
      console.error("Execution Error in TrashToObjectUseCase:", error)
      throw new Error(`TrashToObjectUseCase.execute error: ${error}`)
    }
  }

  private mapToObjectDto(
    objectItem: IObjectDto,
    marimoId: number,
  ): Omit<IObjectDto, "id" | "createdAt" | "updatedAt"> {
    if (!objectItem) {
      console.error(
        "Mapping Error: Received null object when mapping to DTO.",
        { objectItem },
      )
      throw new Error("Invalid object: received null")
    }
    console.log("Mapping object to DTO:", { objectItem, marimoId })
    return {
      ...objectItem,
      marimoId: marimoId,
    }
  }
}
