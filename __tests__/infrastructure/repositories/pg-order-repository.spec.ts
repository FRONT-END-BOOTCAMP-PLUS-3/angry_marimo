import { PrismaClient, Order } from "@prisma/client"
import { PgOrderRepository } from "@marimo/infrastructure/repositories"
import { vi, describe, test, expect, beforeAll, afterAll } from "vitest"

const prismaMock = {
  order: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
}

const orderRepository = new PgOrderRepository(
  prismaMock as unknown as PrismaClient,
)

let testOrder: Order

beforeAll(() => {
  testOrder = {
    id: 1,
    userId: 1,
    marimoId: 1,
    status: "READY",
    amount: 1000,
    paymentKey: "test-key",
    payResponse: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  prismaMock.order.create.mockResolvedValue(testOrder)
  prismaMock.order.update.mockResolvedValue({
    ...testOrder,
    status: "SUCCESS",
    amount: 1500,
  })
  prismaMock.order.findUnique.mockResolvedValue(testOrder)
  prismaMock.order.findMany.mockResolvedValue([testOrder])
})

afterAll(() => {
  vi.clearAllMocks()
})

describe("PgOrderRepository 테스트", () => {
  test("새로운 주문을 생성할 수 있어야 한다.", async () => {
    const newOrder = await orderRepository.create(
      1,
      1,
      "READY",
      2000,
      "key-123",
      {},
    )

    expect(newOrder).toBeDefined()
    expect(newOrder?.userId).toBe(1)

    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        marimoId: 1,
        status: "READY",
        amount: 2000,
        paymentKey: "key-123",
        payResponse: {},
      },
    })
  })

  test("주문 상태와 금액을 업데이트할 수 있어야 한다.", async () => {
    const updatedOrder = await orderRepository.update(
      testOrder.id,
      "SUCCESS",
      1500,
    )
    expect(updatedOrder).toBeDefined()
    expect(updatedOrder?.status).toBe("SUCCESS")
    expect(updatedOrder?.amount).toBe(1500)
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: testOrder.id },
      data: { status: "SUCCESS", amount: 1500 },
    })
  })

  test("ID로 주문을 조회할 수 있어야 한다.", async () => {
    const foundOrder = await orderRepository.findById(testOrder.id)
    expect(foundOrder).toBeDefined()
    expect(foundOrder?.id).toBe(testOrder.id)
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { id: testOrder.id },
    })
  })
})
