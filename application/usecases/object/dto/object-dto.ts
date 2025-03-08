import { InputJsonValue } from "@prisma/client/runtime/client"
export interface IObjectDto {
  id: number
  level: number
  url: string
  type: string // trash, feed...
  rect: InputJsonValue
  marimoId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
