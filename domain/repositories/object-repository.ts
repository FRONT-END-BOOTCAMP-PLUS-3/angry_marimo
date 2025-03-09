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

  update(
    marimoId: number,
    isActive: boolean,
    updateAt: Date,
  ): Promise<Omit<ObjectItem, "id">>
}
