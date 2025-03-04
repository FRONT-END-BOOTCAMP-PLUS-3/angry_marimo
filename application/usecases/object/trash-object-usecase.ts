import { Object as ObjectItem } from "@prisma/client"
import { ObjectRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/library"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { IObjectDto } from "@marimo/application/usecases/object/dto/object-dto"

export class TrashToObjectUseCase {
  constructor(private objectRepository: ObjectRepository) {
    this.objectRepository = objectRepository
  }

  async execute(
    trashData: ITrashDto[],
    marimoId: number,
  ): Promise<Omit<IObjectDto, "id">[]> {
    try {
      console.log("📌 trashData 확인:", JSON.stringify(trashData, null, 2))
      console.log("📌 marimoId 확인:", marimoId)

      if (!trashData || !Array.isArray(trashData) || trashData.length === 0) {
        throw new Error("Invalid input: trashData must be a non-empty array.")
      }
      if (!marimoId) {
        throw new Error("Invalid input: marimoId is missing.")
      }

      // 🔥 모든 trashData를 한꺼번에 DB에 저장
      const createdObjects = await Promise.all(
        trashData.map(async (trashItem) => {
          return this.objectRepository.create(
            marimoId,
            trashItem.type,
            {
              x: trashItem.rect.x,
              y: trashItem.rect.y,
            } as InputJsonValue,
            true,
            trashItem.url,
            trashItem.level,
          )
        }),
      )

      console.log("✅ 생성된 trashObjects:", createdObjects)

      if (!createdObjects || createdObjects.length === 0) {
        throw new Error("Failed to create objects from trash data")
      }

      // 🔄 생성된 객체들을 Omit<IObjectDto, "id"> 배열로 변환
      const mappedObjects: Omit<IObjectDto, "id">[] = createdObjects.map(
        (trashObject) => this.mapToObjectDto(trashObject),
      )
      console.log("✅ 변환된 IObjectDto 배열 (id 제외됨):", mappedObjects)

      return mappedObjects
    } catch (error) {
      console.error("❌ TrashToObjectUseCase.execute error:", error)
      throw new Error(`TrashToObjectUseCase.execute error: ${error}`)
    }
  }

  private mapToObjectDto(
    objectItem: ObjectItem | null,
  ): Omit<IObjectDto, "id"> {
    if (!objectItem) {
      throw new Error("Invalid object: received null")
    }
    return {
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
