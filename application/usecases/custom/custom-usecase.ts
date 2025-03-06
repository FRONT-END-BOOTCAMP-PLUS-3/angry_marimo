import { CouponRepository } from "@marimo/domain/repositories/coupon-repository"

import { MarimoRepository } from "@marimo/domain/repositories"
import { Coupon, Marimo, Object as TObject } from "@prisma/client"
import {
  GetDataDto,
  UpdateCustomDto,
} from "@marimo/application/usecases/custom/dto"

export class CustomUsecase {
  constructor(
    private couponRepository: CouponRepository,
    private marimoRepository: MarimoRepository,
  ) {}

  async getData(userId: number): Promise<GetDataDto> {
    const coupons = (await this.couponRepository.findAllByUserId(userId)) ?? []
    const count = (await this.couponRepository.countByUserId(userId)) ?? 0
    const marimo = await this.marimoRepository.findAliveMarimo(userId)

    return {
      count,
      coupons,
      marimo,
    }
  }

  // [ ] : 마리모 이미지 저장
  // [ ] : 마리모 이미지 주소지 받아오기

  async updateCustom(
    marimo: Marimo & { object: TObject[] },
    coupon: Coupon,
  ): Promise<UpdateCustomDto> {
    const { createdAt, updatedAt, object, ...customMarimo } = marimo

    const updatedMarimo = await this.marimoRepository.updateMarimo(
      marimo.id,
      customMarimo,
    )

    await this.couponRepository.update(coupon.id)

    return { marimo: updatedMarimo }
  }
}
