import type { Object as ObjectItem } from "@prisma/client"

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
  ): Promise<ObjectItem | null>
}
