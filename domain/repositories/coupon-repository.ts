import { Coupon } from "@prisma/client"

export interface CouponRepository {
  create(
    userId: number,
    code?: string,
    isUsed?: boolean,
  ): Promise<Coupon | null>

  update(id: number, isUsed?: boolean): Promise<Coupon | null>

  findById(id: number): Promise<Coupon | null>

  findAllByUserId(userId: number): Promise<Coupon[] | null>

  countByUserId(userId: number): Promise<number>
}
