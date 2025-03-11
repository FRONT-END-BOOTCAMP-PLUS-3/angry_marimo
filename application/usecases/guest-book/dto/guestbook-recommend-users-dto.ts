import { Marimo, User } from "@prisma/client"

export interface getRecommendUsersDto {
  users:
    | (User & {
        marimos: Marimo[]
      })[]
    | null
}
