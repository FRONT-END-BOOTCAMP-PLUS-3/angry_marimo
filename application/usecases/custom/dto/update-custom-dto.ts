import { MarimoImage } from "@prisma/client"

export interface UpdateCustomDto {
  images: MarimoImage | null
}
