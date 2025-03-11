import type { Object as ObjectItem } from "@prisma/client"

import { InputJsonValue } from "@prisma/client/runtime/client"
export interface ObjectRepository {
  create(
    marimoId: number,
    type: string,
    rect: InputJsonValue,
    isActive: boolean,
    url: string,
    level: number,
  ): Promise<Omit<ObjectItem, "id">>

  createAll(
    objects: {
      marimoId: number
      type: string
      rect: InputJsonValue
      isActive: boolean
      url: string
      level: number
    }[],
  ): Promise<void>

  update(
    marimoId: number,
    isActive: boolean,
    updateAt: Date,
  ): Promise<Omit<ObjectItem, "id">>

  findById(id: number): Promise<ObjectItem | null>

  // 마리모 ID 에서 isActive 가 true 인 것만 반환할 수 있도록 함.
  findAllByMarimoId(marimoId: number): Promise<ObjectItem[] | null>
}
