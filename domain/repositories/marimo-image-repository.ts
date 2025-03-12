import { MarimoImage } from "@prisma/client"

export interface MarimoImageRepository {
  findOneImageByMarimoId(marimoId: number): Promise<MarimoImage | null>

  createImages(
    data: Omit<MarimoImage, "id" | "createdAt" | "updatedAt">,
  ): Promise<MarimoImage>
}
