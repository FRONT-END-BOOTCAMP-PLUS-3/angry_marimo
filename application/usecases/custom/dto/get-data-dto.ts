import { Coupon, Marimo } from "@prisma/client"

export interface GetDataDto {
  count: number
  coupons: Coupon[] | null
  marimo: Marimo | null
}
