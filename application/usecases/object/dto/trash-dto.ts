export interface ITrashDto {
  id: number
  level: number
  url: string
  rect: {
    x: number
    y: number
  }
  type: string // "trash"| "feed"| "object" 형식이다.
}
