import { describe, test, expect, vi, beforeEach } from "vitest"
import { InputJsonValue } from "@prisma/client/runtime/client"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

// Mock Object Repository
const mockObjectRepository = {
  create: vi.fn(),
  update: vi.fn(),
}

// Helper function to create mock trash data
const createMockTrashData = (): ITrashDto[] => [
  {
    id: 1,
    type: "trash",
    rect: { x: 10, y: 20 },
    url: "http://example.com/image.png",
    level: 1,
  },
]

describe("TrashToObjectUseCase.execute", () => {
  let useCase: TrashToObjectUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new TrashToObjectUseCase(mockObjectRepository)
  })

  test("should throw an error if trashData is missing or empty", async () => {
    await expect(useCase.execute([], 1)).rejects.toThrow(
      "Invalid input: trashData must be a non-empty array.",
    )
  })

  test("should throw an error if marimoId is missing", async () => {
    return await expect(
      useCase.execute(createMockTrashData(), 0),
    ).rejects.toThrow("Invalid input: marimoId is missing.")
  })

  test("should create objects and return mapped data", async () => {
    const mockTrashData = createMockTrashData()
    const mockCreatedObjects = mockTrashData.map((trash) => ({
      type: trash.type,
      position: { x: trash.rect.x, y: trash.rect.y } as InputJsonValue,
      url: trash.url,
      level: trash.level,
    }))

    mockObjectRepository.create.mockResolvedValueOnce(mockCreatedObjects[0])

    const result = await useCase.execute(mockTrashData, 1)

    expect(mockObjectRepository.create).toHaveBeenCalledTimes(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "trash",
          url: "http://example.com/image.png",
          level: 1,
        }),
      ]),
    )
  })
})
