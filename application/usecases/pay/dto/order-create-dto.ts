import { TOrderStatus } from "@marimo/types"

export interface OrderCreateDto {
  id: number
  status: TOrderStatus
  amount: number
  paymentKey: string
}
