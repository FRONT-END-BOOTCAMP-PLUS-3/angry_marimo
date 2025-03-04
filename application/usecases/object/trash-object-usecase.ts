import { Object as ObjectItem } from "@prisma/client"
import { ObjectRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/library"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { IObjectDto } from "@marimo/application/usecases/object/dto/object-dto"

export class TrashToObjectUseCase {
  constructor(private objectRepository: ObjectRepository) {
    this.objectRepository = objectRepository
  }

  async execute(trashData: ITrashDto, marimoId: number): Promise<IObjectDto> {
    try {
      console.log("📌 trashData 확인:", JSON.stringify(trashData, null, 2))
      console.log("📌 marimoId 확인:", marimoId)

      if (!trashData || !marimoId) {
        throw new Error("Invalid input: trashData or marimoId is missing.")
      }

      const trashObject = await this.objectRepository.create(
        marimoId,
        trashData.type,
        {
          x: trashData.rect.x,
          y: trashData.rect.y,
        } as InputJsonValue,
        true,
        trashData.url,
        trashData.level,
      )

      console.log("✅ 생성된 trashObject:", trashObject)

      if (!trashObject) {
        throw new Error("Failed to create object from trash data")
      }

      console.log("🚀 Mapping trashObject:", trashObject)
      const mappedObject = this.mapToObjectDto(trashObject)
      console.log("✅ 변환된 IObjectDto:", mappedObject)

      return mappedObject
    } catch (error) {
      console.error("❌ TrashToObjectUseCase.execute error:", error)
      throw new Error(`TrashToObjectUseCase.execute error: ${error}`)
    }
  }

  private mapToObjectDto(objectItem: ObjectItem): IObjectDto {
    return {
      id: objectItem.id,
      marimoId: objectItem.marimoId,
      type: objectItem.type,
      rect: objectItem.rect as { x: number; y: number },
      isActive: objectItem.isActive,
      url: objectItem.url,
      level: objectItem.level,
      createdAt: objectItem.createdAt,
      updatedAt: objectItem.updatedAt,
    }
  }
}
