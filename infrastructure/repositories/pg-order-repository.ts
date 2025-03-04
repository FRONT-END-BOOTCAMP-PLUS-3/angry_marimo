import { OrderRepository } from "@marimo/domain/repositories/order-repository"

import { TOrderStatus } from "@marimo/types"
import { PrismaClient, Order } from "@prisma/client"
import { InputJsonValue } from "@prisma/client/runtime/client"

export class PgOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    userId: number,
    marimoId: number,
    status: TOrderStatus,
    amount: number,
    paymentKey: string,
    payResponse: InputJsonValue,
  ): Promise<Order | null> {
    try {
      const newOrder = await this.prisma.order.create({
        data: { userId, marimoId, status, amount, paymentKey, payResponse },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgOrderRepository.create Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async update(
    id: number,
    status: TOrderStatus,
    amount: number,
  ): Promise<Order | null> {
    try {
      const newOrder = await this.prisma.order.update({
        where: { id },
        data: { status, amount },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgOrderRepository.update Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findById(id: number): Promise<Order | null> {
    try {
      const newOrder = await this.prisma.order.findUnique({
        where: { id },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgOrderRepository.findById Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findAllByUserId(userId: number): Promise<Order[] | null> {
    try {
      const newOrder = await this.prisma.order.findMany({
        where: { userId },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgOrderRepository.findById Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findAllOrders(): Promise<Order[] | null> {
    try {
      const newOrder = await this.prisma.order.findMany({
        where: {
          status: "SUCCESS",
        },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgOrderRepository.findById Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }
}
