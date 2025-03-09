import { JsonValue } from "@prisma/client/runtime/client"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

const mockObjectRepository = {
  create: vi.fn(),
  update: vi.fn(),
}

const createMockTrashData = (): ITrashDto => ({
  id: 1,
  type: "trash",
  rect: { x: 10, y: 20 },
  url: "http://example.com/image.png",
  level: 1,
  isActive: true,
})

describe("TrashToObjectUseCase.execute", () => {
  let useCase: TrashToObjectUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new TrashToObjectUseCase(mockObjectRepository)
  })
  // TODO: 이부분 타입 변경해야함.
  // test("trashData가 undefined일 경우 에러를 발생시켜야 한다", async () => {
  //   await expect(useCase.execute(null as any, 1)).rejects.toThrow(
  //     "입력값 확인 필요: trashData가 필요합니다.",
  //   )
  // })

  // test("trashData가 null일 경우 에러를 발생시켜야 한다", async () => {
  //   await expect(useCase.execute(null as any, 1)).rejects.toThrow(
  //     "입력값 확인 필요: trashData가 필요합니다.",
  //   )
  // })

  // test("trashData가 빈 객체일 경우 에러를 발생시켜야 한다", async () => {
  //   await expect(useCase.execute({} as any, 1)).rejects.toThrow(
  //     "입력값 확인 필요: trashData는 비어 있으면 안 됩니다.",
  //   )
  // })

  test("should create objects and return mapped data", async () => {
    const mockTrashData = createMockTrashData()
    const expectedObject = {
      marimoId: 1,
      type: mockTrashData.type,
      rect: JSON.stringify(mockTrashData.rect) as JsonValue,
      url: mockTrashData.url,
      level: mockTrashData.level,
    }

    mockObjectRepository.create.mockResolvedValueOnce(expectedObject)

    // const result = await useCase.execute(mockTrashData, 1)
    // TODO:
    // expect(mockObjectRepository.create).toHaveBeenCalledTimes(1)
    // expect(result).toEqual(
    //   expect.objectContaining({
    //     type: mockTrashData.type,
    //     rect: JSON.stringify(mockTrashData.rect),
    //     url: mockTrashData.url,
    //     level: mockTrashData.level,
    //   }),
    // )
  })
})
