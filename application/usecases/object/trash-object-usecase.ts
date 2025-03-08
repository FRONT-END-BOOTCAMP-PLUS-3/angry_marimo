import { ITrashDto } from "./dto/trash-dto"
import { IObjectDto } from "./dto/object-dto"
import { ObjectRepository } from "@marimo/domain/repositories"

export class TrashToObjectUseCase {
  constructor(private objectRepository: ObjectRepository) {}

  async execute(
    trashData: ITrashDto,
    marimoId: number,
  ): Promise<Omit<IObjectDto, "id">> {
    try {
      if (!trashData) {
        throw new Error("Invalid input: trashData is required.")
      }
      if (!marimoId) {
        throw new Error("Invalid input: marimoId is missing.")
      }
      if (!trashData.rect || trashData.rect === null) {
        throw new Error("Invalid input: rect data is missing or null.")
      }

      const rectJson = JSON.stringify(trashData.rect)

      const objectItem = await this.objectRepository.create(
        marimoId,
        trashData.type,
        rectJson,
        true,
        trashData.url,
        trashData.level,
      )

      if (!objectItem) {
        throw new Error("Failed to create object from trash data")
      }

      return this.mapToObjectDto(objectItem)
    } catch (error) {
      throw new Error(`TrashToObjectUseCase.execute error: ${error}`)
    }
  }

  private mapToObjectDto(
    objectItem: Omit<IObjectDto, "id">,
  ): Omit<IObjectDto, "id"> {
    if (!objectItem) {
      throw new Error("Invalid object: received null")
    }
    return {
      marimoId: objectItem.marimoId,
      type: objectItem.type,
      rect: objectItem.rect,
      isActive: objectItem.isActive,
      url: objectItem.url,
      level: objectItem.level,
      createdAt: objectItem.createdAt,
      updatedAt: objectItem.updatedAt,
    }
  }
}
