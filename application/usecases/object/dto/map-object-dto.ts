import { IObjectDto } from "@marimo/application/usecases/object/dto/object-dto"

export const mapToObjectDto = (
  objectItem: IObjectDto,
  marimoId: number,
): Omit<IObjectDto, "id" | "createdAt" | "updatedAt"> => {
  if (!objectItem) {
    throw new Error("Invalid object: received null")
  }

  const { ...rest } = objectItem

  return {
    ...rest,
    marimoId: marimoId,
  }
}
