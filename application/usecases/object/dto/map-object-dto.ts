import { IObjectDto } from "./object-dto"

export const mapToObjectDto = (
  objectItem: IObjectDto,
  marimoId: number,
): Omit<IObjectDto, "id" | "createdAt" | "updatedAt"> => {
  if (!objectItem) {
    throw new Error("Invalid object: received null")
  }

  const { createdAt, updatedAt, ...rest } = objectItem

  return {
    ...rest,
    marimoId: marimoId,
  }
}
