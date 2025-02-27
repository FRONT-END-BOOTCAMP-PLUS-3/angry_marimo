import { ObjectDto } from "./dto/object-dto"
import { ObjectRepository } from "@marimo/domain/repositories"

export class ObjectUsecase {
  constructor(private objectRepository: ObjectRepository) {}

  async expect(): Promise<ObjectDto | null> {}
}
