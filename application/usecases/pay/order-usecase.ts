import { sumValues } from "@marimo/utils/sum-values"

import { TOrderStatus } from "@marimo/types"
import { OrderRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/client"
import {
  OrderAllAmountDto,
  OrderCreateDto,
} from "@marimo/application/usecases/pay/dto"

export class OrderUsecase {
  constructor(private orderRepository: OrderRepository) {}

  async getAllAmount(): Promise<OrderAllAmountDto | null> {
    const orders = await this.orderRepository.findAllOrders()

    const amounts = orders?.map((order) => order.amount) || []

    return {
      count: orders ? amounts.length : 0,
      amount: sumValues(amounts),
    }
  }

  async excuse(
    userId: number,
    marimo: number,
    status: TOrderStatus,
    amount = 0,
    paymentKey = "",
    payResponse: InputJsonValue,
  ): Promise<OrderCreateDto | null> {
    const order = await this.orderRepository.create(
      userId,
      marimo,
      status,
      amount,
      paymentKey,
      payResponse,
    )

    const newOrder = order
      ? ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          paymentKey: order.paymentKey,
        } as OrderCreateDto)
      : null

    return newOrder
  }
}
