import { cookies } from "next/headers"

import { POST, GET } from "@marimo/app/api/pay/order/route"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { OrderUsecase } from "@marimo/application/usecases/pay/order-usecase"
import { vi, expect, test, describe, beforeEach, afterEach, Mock } from "vitest"

beforeEach(() => {
  vi.mock("next/headers", () => ({
    cookies: vi.fn(),
  }))

  vi.mock("@marimo/application/usecases/auth/user-usecase", () => ({
    UserUsecase: vi.fn().mockImplementation(() => ({
      getUser: vi.fn(),
    })),
  }))

  vi.mock("@marimo/application/usecases/pay/order-usecase", () => ({
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

describe("Order API 테스트", () => {
  test("GET 요청 시 금액을 반환해야 한다", async () => {
    const mockAmount = 1000

    const usecaseMock = {
      getAllAmount: vi.fn().mockResolvedValue(mockAmount),
    }

    vi.mocked(OrderUsecase).mockReturnValue(usecaseMock as any)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(mockAmount)
  })

  test("GET 요청 시 금액이 없으면 에러 메시지를 반환해야 한다", async () => {
    const usecaseMock = {
      getAllAmount: vi.fn().mockResolvedValue(null),
    }

    vi.mocked(OrderUsecase).mockReturnValue(usecaseMock as any)

    const response = await GET()

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      message: "잠시 후 다시 시도해주세요!",
    })
  })

  test("POST 요청 시 로그인 실패 시 401 에러 반환", async () => {
    const request = {
      json: vi.fn().mockResolvedValue({
        marimoId: "marimoId",
        amount: 1000,
        paymentKey: "paymentKey",
      }),
    }

    ;(cookies as Mock).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue(undefined),
    })

    const response = await POST(request as any)

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ message: "login failed" })
  })

  test("POST 요청 시 로그인 성공 후 주문 생성", async () => {
    const request = {
      json: vi.fn().mockResolvedValue({
        marimoId: "marimoId",
        amount: 1000,
        paymentKey: "paymentKey",
        payResponse: "response",
      }),
    }

    const userUsecaseMock = {
      getUser: vi.fn().mockResolvedValue({ id: 1, name: "John Doe" }),
    }

    const orderUsecaseMock = {
      excuse: vi
        .fn()
        .mockResolvedValue({ id: 1, marimoId: "marimoId", amount: 1000 }),
    }

    vi.mocked(UserUsecase).mockReturnValue(userUsecaseMock as any)
    vi.mocked(OrderUsecase).mockReturnValue(orderUsecaseMock as any)
    ;(cookies as Mock).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue({ value: "valid-token" }), // 유효한 토큰
    })
    const response = await POST(request as any)

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      id: 1,
      marimoId: "marimoId",
      amount: 1000,
    })
  })

  test("POST 요청 시 예외 처리", async () => {
    const request = {
      json: vi.fn().mockResolvedValue({
        marimoId: "marimoId",
        amount: 1000,
        paymentKey: "paymentKey",
        payResponse: "response",
      }),
    }

    ;(cookies as Mock).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue({ value: "valid-token" }), // 유효한 토큰
    })

    const userUsecaseMock = {
      getUser: vi.fn().mockResolvedValue({ id: 1, name: "John Doe" }),
    }

    const orderUsecaseMock = {
      excuse: vi.fn().mockRejectedValue(new Error("Order creation failed")),
    }

    vi.mocked(UserUsecase).mockReturnValue(userUsecaseMock as any)
    vi.mocked(OrderUsecase).mockReturnValue(orderUsecaseMock as any)

    const response = await POST(request as any)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      message: "Order create Error : Error: Order creation failed",
    })
  })
})
