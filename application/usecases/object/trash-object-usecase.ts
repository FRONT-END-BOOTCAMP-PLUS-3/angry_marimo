import { InputJsonValue } from "@prisma/client/runtime/library"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { IObjectDto } from "@marimo/application/usecases/object/dto/object-dto"

export class TrashToObjectUseCase {
  async execute(
    trashItems: ITrashDto[],
    marimoId: number,
  ): Promise<IObjectDto[]> {
    return await Promise.all(
      trashItems.map(async (trash) => ({
        id: trash.id,
        level: trash.level,
        url: trash.url,
        type: trash.type,
        rect: {
          x: trash.rect.x,
          y: trash.rect.y,
        } as InputJsonValue, // Prisma JSON 타입 변환

        marimoId,
        isActive: true, // 기본 활성 상태
        createdAt: new Date(), // 현재 시간 설정
        updatedAt: new Date(), // 현재 시간 설정
      })),
    )
  }
}
