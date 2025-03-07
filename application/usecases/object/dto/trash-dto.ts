export interface ITrashDto {
  id: number
  isActive: boolean
  level: number
  url: string
  rect: {
    x: number
    y: number
  }
  type: string // "trash"| "feed"| "object" 형식이다.
}
