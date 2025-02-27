import { InputJsonValue } from "@prisma/client/runtime/client"

export interface ObjectDto {
  id: number
  level: number
  url: string
  type: string // trash, feed...?
  rect: InputJsonValue // x, y 좌표값 넣을 거임

  marimoId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
