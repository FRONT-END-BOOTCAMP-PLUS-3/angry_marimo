import { InputJsonValue } from "@prisma/client/runtime/client"

export interface ObjectDto {
  id: number
  marimoId: number
  rect: InputJsonValue // x, y 좌표값 넣을 거임
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  type: [] // trash[], present[], feed[]...
}
