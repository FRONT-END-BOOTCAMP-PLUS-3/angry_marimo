import { GuestBook } from "@prisma/client"

export interface getAllByOwnerIdDto {
  posts: GuestBook[] | null
}
