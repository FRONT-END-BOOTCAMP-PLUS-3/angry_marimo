import { MarimoImage } from "@prisma/client"
import { MarimoImageRepository } from "@marimo/domain/repositories"

export class MarimoImageUsecase {
  constructor(private marimoImageRepository: MarimoImageRepository) {}

  async getMarimoImageByMarimoId(
    marimoId: number,
  ): Promise<MarimoImage | null> {
    try {
      const images =
        await this.marimoImageRepository.findOneImageByMarimoId(marimoId)

      return images
    } catch (error) {
      console.error("Error ensuring Alive Marimo:", error)
      throw error
    }
  }
}
