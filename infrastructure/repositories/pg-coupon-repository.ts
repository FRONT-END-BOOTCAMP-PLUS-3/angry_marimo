import { CouponRepository } from "@marimo/domain/repositories/coupon-repository"

import { PrismaClient, Coupon } from "@prisma/client"

export class PgCouponRepository implements CouponRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    userId: number,
    code = "pay",
    isUsed = false,
  ): Promise<Coupon | null> {
    try {
      const newCoupon = await this.prisma.coupon.create({
        data: {
          userId,
          code,
          isUsed,
        },
      })

      return newCoupon || null
    } catch (error) {
      throw new Error(`PgCouponRepository.create Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async update(id: number, isUsed = true): Promise<Coupon | null> {
    try {
      const newOrder = await this.prisma.coupon.update({
        where: { id },
        data: { isUsed },
      })

      return newOrder || null
    } catch (error) {
      throw new Error(`PgCouponRepository.update Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findById(id: number): Promise<Coupon | null> {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: { id },
      })

      return coupon || null
    } catch (error) {
      throw new Error(`PgCouponRepository.findById Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async findAllByUserId(userId: number): Promise<Coupon[] | null> {
    try {
      const coupons = await this.prisma.coupon.findMany({
        where: { userId, isUsed: false },
      })

      return coupons || null
    } catch (error) {
      throw new Error(`PgCouponRepository.findById Error ====> \n ${error}`)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  async countByUserId(userId: number): Promise<number> {
    try {
      const count = await this.prisma.coupon.count({
        where: { userId, isUsed: false },
      })

      return count
    } catch (error) {
      throw new Error(
        `PgCouponRepository.countByUserId Error ====> \n ${error}`,
      )
    } finally {
      await this.prisma.$disconnect()
    }
  }
}
