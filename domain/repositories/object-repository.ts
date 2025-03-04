import type { Object as ObjectItem } from "@prisma/client"
// javascript 의 object 타입과의 충돌로 인해서 type 은 ObjectItem 으로 사용하겠습니다~

import { InputJsonValue } from "@prisma/client/runtime/client"

export interface ObjectRepository {
  create(
    marimoId: number,
    type: string,
    react: InputJsonValue,
    isActive: boolean,
    url: string,
    level: number,
  ): Promise<ObjectItem | null>

  update(
    id: number,
    isActive: boolean,
    updateAt: Date,
    // level: number,
  ): Promise<ObjectItem | null>

  findById(id: number): Promise<ObjectItem | null>

  findAllByMarimoId(marimoId: number): Promise<ObjectItem[] | null>

  deleteObject(id: number): Promise<void>
}
