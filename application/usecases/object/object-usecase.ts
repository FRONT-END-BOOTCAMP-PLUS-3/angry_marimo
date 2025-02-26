import { ObjectDto } from "./dto/object-dto"
import { ObjectRepository } from "@marimo/domain/repositories"

export class ObjectUsecase {
  constructor(private objectRepository: ObjectRepository) {}

  async expect(): Promise<ObjectDto | null> {
    const objectItems = await this.objectRepository.findAllObjects()
    const trashObject = objectItems.map
    return{

    }
  }
}
