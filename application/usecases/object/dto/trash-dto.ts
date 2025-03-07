import { JsonValue } from "@prisma/client/runtime/client"

export interface ITrashDto {
  id: number
  isActive: boolean
  level: number
  url: string
  rect: JsonValue
  type: string
  isActive: boolean
}
