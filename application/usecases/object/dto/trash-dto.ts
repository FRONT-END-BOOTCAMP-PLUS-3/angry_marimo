import { JsonValue } from "@prisma/client/runtime/client"

export interface ITrashDto {
  id: number
  level: number
  url: string
  rect: JsonValue
  type: string
  isActive: boolean
}
