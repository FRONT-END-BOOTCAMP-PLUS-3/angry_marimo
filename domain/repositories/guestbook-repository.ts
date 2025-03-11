import { GuestBook } from "@prisma/client"

export interface GuestBookRepository {
  create(
    data: Omit<GuestBook, "id" | "createdAt" | "updatedAt">,
  ): Promise<GuestBook | null>

  getAllPostByOwnerId(ownerId: number): Promise<GuestBook[] | null>
}
