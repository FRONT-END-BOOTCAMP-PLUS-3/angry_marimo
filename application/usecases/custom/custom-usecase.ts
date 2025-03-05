import { CouponRepository } from "@marimo/domain/repositories/coupon-repository"

import { MarimoRepository } from "@marimo/domain/repositories"

export class CustomUsecase {
  constructor(
    private couponRepository: CouponRepository,
    private marimoRepository: MarimoRepository,
  ) {}

  async getData(userId: number) {
    // [x] : 사용 가능한 티켓 불러오기
    const tickets = await this.couponRepository.countByUserId(userId)
    const count = await this.couponRepository.countByUserId(userId)

    // [ ] : 마리모 데이터 불러오기
    const marimo = await this.marimoRepository.findAliveMarimo(userId)

    console.log("============= custom usecase GET =============")
    console.log("tickets --->", tickets)
    console.log("count --->", count)
    console.log("marimo --->", marimo)

    return {
      count,
      tickets,
      marimo,
    }
  }

  async updateCustom() {
    // [ ] : 마리모 이미지 저장
    // [ ] : 마리모 이미지 주소지 받아오기
    // [ ] : 마리모 이름과 이미지 주소 update
    // [ ] : 티켓 사용 완료로 변경
    // [ ] : updated 정보 반환
  }
}
