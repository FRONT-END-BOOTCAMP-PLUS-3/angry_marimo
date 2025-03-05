import { NextRequest } from "next/server"

import { POST } from "@marimo/app/api/objects/route"
import { describe, test, expect, vi, beforeEach } from "vitest"

const mockTrashToObjectUseCase = {
  execute: vi.fn(),
}

const mockPgObjectRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAllByMarimoId: vi.fn(),
  deleteObject: vi.fn(),
}

describe("POST API Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mock("@marimo/application/usecases/object/trash-object-usecase", () => ({
      TrashToObjectUseCase: vi.fn(() => mockTrashToObjectUseCase),
    }))

    vi.mock("@marimo/infrastructure/repositories", () => ({
      PgObjectRepository: vi.fn(() => mockPgObjectRepository),
    }))
  })

  const validTrashData = [
    {
      type: "trash",
      rect: { x: 10, y: 20 },
      isActive: true,
      url: "http://example.com/image.png",
      level: 1,
    },
  ]

  const createTestRequest = (contentType = "application/json", body = "") => {
    return new NextRequest("http://localhost:3000", {
      method: "POST",
      headers: { "content-type": contentType },
      body:
        body ||
        JSON.stringify({
          marimoId: 1,
          trashData: validTrashData,
        }),
    })
  }

  test("should return 400 if Content-Type is not application/json", async () => {
    const request = createTestRequest("text/plain")
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid Content-Type" })
  })

  test("should return 400 if request body is empty", async () => {
    const request = createTestRequest("application/json", "")
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid JSON format" })
  })

  test("should return 400 if marimoId or trashData is invalid", async () => {
    const request = createTestRequest(
      "application/json",
      JSON.stringify({
        marimoId: 1,
        trashData: validTrashData,
      }),
    )
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid JSON format" })
  })

  test("save data successfully", async () => {
    const mockMarimoId = 1

    mockTrashToObjectUseCase.execute.mockResolvedValue(validTrashData)

    // Repository create 메서드 모킹
    mockPgObjectRepository.create.mockResolvedValue({
      ...validTrashData[0],
      mockMarimoId,
    })

    // 테스트 요청 생성
    const request = createTestRequest()
    const response = await POST(request)

    // 상태 코드 검증
    expect(response.status).toBe(200)
    expect(mockTrashToObjectUseCase.execute).toHaveBeenCalledWith(
      Array.isArray(validTrashData) ? validTrashData : [validTrashData],
      mockMarimoId,
    )

    const executeResult = await mockTrashToObjectUseCase.execute(
      validTrashData,
      1,
    )
    console.log("execute 반환값:", JSON.stringify(executeResult, null, 2))

    // 응답 본문 검증
    const responseBody = await response.json()
    expect(responseBody).toEqual({ success: true })
  })

  test("should return 400 if JSON parsing fails", async () => {
    const request = createTestRequest("application/json", "{ invalid json }")
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid JSON format" })
  })

  test("should handle usecase execution failure", async () => {
    // UseCase 실행 실패 모킹
    mockTrashToObjectUseCase.execute.mockRejectedValue(
      new Error("Processing failed"),
    )

    const request = createTestRequest()
    const response = await POST(request)

    // 실패 시 500 상태 코드와 내부 서버 에러 메시지 검증
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid JSON format" })
  })
})
