import { Marimo } from "@prisma/client"

export interface UpdateCustomDto {
  marimo: Marimo | null
}
