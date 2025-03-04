import { Order } from "@prisma/client"
import { TOrderStatus } from "@marimo/types"
import { InputJsonValue } from "@prisma/client/runtime/client"

export interface OrderRepository {
  create(
    userId: number,
    marimoId: number,
    status: TOrderStatus,
    amount: number,
    paymentKey: string,
    payResponse: InputJsonValue,
  ): Promise<Order | null>

  update(
    id: number,
    status: TOrderStatus,
    amount: number,
  ): Promise<Order | null>

  findById(id: number): Promise<Order | null>

  findAllByUserId(userId: number): Promise<Order[] | null>

  findAllOrders(): Promise<Order[] | null>
}
