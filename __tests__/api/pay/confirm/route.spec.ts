import { POST } from "@marimo/app/api/pay/confirm/route"
import { vi, expect, test, describe, beforeEach, afterEach } from "vitest"

beforeEach(() => {
  vi.mock("@marimo/application/usecases/pay/order-usecase.ts", () => ({
    OrderUsecase: vi.fn().mockImplementation(() => ({
      getAllAmount: vi.fn(),
      excuse: vi.fn(),
    })),
  }))

  vi.mock("@marimo/infrastructure/repositories", () => ({
    PgOrderRepository: vi.fn(),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe("Toss Confirm API 테스트", () => {
  test("정상적인 요청에 대해 결과를 반환해야 한다", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        paymentKey: "payment_key_example",
        orderId: "order_123",
        amount: 1000,
      }),
    }

    const mockFetchResponse = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ status: "success" }),
    }

    global.fetch = vi.fn().mockResolvedValue(mockFetchResponse)

    const response = await POST(mockRequest as any)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData).toEqual({ status: "success" })
  })

  test("잘못된 응답에 대해 오류를 반환해야 한다", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        paymentKey: "payment_key_example",
        orderId: "order_123",
        amount: 1000,
      }),
    }

    const mockFetchResponse = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: "Invalid payment" }),
    }

    global.fetch = vi.fn().mockResolvedValue(mockFetchResponse)

    const response = await POST(mockRequest as any)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData).toEqual({ error: "Invalid payment" })
  })

  test("예외 상황에서 오류 메시지를 반환해야 한다", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        paymentKey: "payment_key_example",
        orderId: "order_123",
        amount: 1000,
      }),
    }

    global.fetch = vi.fn().mockRejectedValue(new Error("Toss Confirm Error"))

    const response = await POST(mockRequest as any)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData).toEqual({
      message: "Toss Confirm Error: Error: Toss Confirm Error",
    })
  })
})
