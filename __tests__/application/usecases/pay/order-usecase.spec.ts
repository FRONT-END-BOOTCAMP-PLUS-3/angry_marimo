import { sumValues } from "@marimo/utils/sum-values"

import { TOrderStatus } from "@marimo/types"
import { describe, test, expect, vi, Mock } from "vitest"
import { OrderRepository } from "@marimo/domain/repositories"
import { OrderUsecase } from "@marimo/application/usecases/pay/order-usecase"

describe("OrderUsecase 테스트", () => {
  const mockOrderRepository: OrderRepository = {
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    findAllByUserId: vi.fn(),
    findAllOrders: vi.fn(),
  }

  const orderUsecase = new OrderUsecase(mockOrderRepository)

  const findAllOrders = mockOrderRepository.findAllOrders as Mock
  const create = mockOrderRepository.create as Mock

  test("모든 주문 금액을 가져오는 함수(getAllAmount)", async () => {
    const orders = [{ amount: 100 }, { amount: 200 }, { amount: 300 }]

    findAllOrders.mockResolvedValue(orders)

    const result = await orderUsecase.getAllAmount()

    expect(result).toEqual({
      count: 3,
      amount: sumValues([100, 200, 300]),
    })
  })

  test("모든 주문 금액을 가져올 때 주문이 없으면 null을 반환", async () => {
    findAllOrders.mockResolvedValue([])

    const result = await orderUsecase.getAllAmount()

    expect(result).toEqual({
      count: 0,
      amount: 0,
    })
  })

  test("주문을 생성하는 함수(excuse)", async () => {
    const userId = 1
    const marimo = 100
    const status: TOrderStatus = "READY"
    const amount = 500
    const paymentKey = "somePaymentKey"
    const payResponse = { success: true }

    const mockOrder = {
      id: 1,
      status,
      amount,
      paymentKey,
    }

    create.mockResolvedValue(mockOrder)

    const result = await orderUsecase.excuse(
      userId,
      marimo,
      status,
      amount,
      paymentKey,
      payResponse,
    )

    expect(result).toEqual({
      id: 1,
      status,
      amount,
      paymentKey,
    })
  })

  test("주문을 생성하는 함수(excuse)에서 주문이 생성되지 않으면 null을 반환", async () => {
    create.mockResolvedValue(null)

    const result = await orderUsecase.excuse(
      1,
      100,
      "READY",
      500,
      "paymentKey",
      { success: true },
    )

    expect(result).toBeNull()
  })
})
