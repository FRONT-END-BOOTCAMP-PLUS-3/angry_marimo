import { JsonValue } from "@prisma/client/runtime/library"

export interface IObjectDto {
  level: number
  url: string
  type: string
  rect: JsonValue
  marimoId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
