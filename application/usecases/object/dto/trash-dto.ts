import { InputJsonValue } from "@prisma/client/runtime/client"

export interface ITrashDto {
  id: number
  level: number
  url: string
  rect: InputJsonValue
  type: string
  isActive: boolean
}
