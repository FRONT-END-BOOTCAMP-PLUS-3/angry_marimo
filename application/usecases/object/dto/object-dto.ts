import { JsonValue } from "@prisma/client/runtime/client"
export interface IObjectDto {
  // id: number
  level: number
  url: string
  type: string // trash, feed...
  //TODO: 이부분 inputJsonvalue 로 하면 에러남..근데 사용해야하는디..
  rect: JsonValue
  marimoId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
