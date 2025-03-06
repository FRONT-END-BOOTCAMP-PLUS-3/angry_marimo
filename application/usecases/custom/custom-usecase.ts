import { CouponRepository } from "@marimo/domain/repositories/coupon-repository"

import path from "path"
import fs from "fs/promises"
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

  async saveMarimoImage(file: File): Promise<string> {
    console.log("-------- saveMarimoImage --------")
    const storageDir = process.env.NEXT_STORAGE_SRC ?? "../storage"
    const resolvedPath = path.resolve(storageDir)

    await fs.mkdir(resolvedPath, { recursive: true })

    const filePath = path.join(storageDir, file.name)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    return `${process.env.NEXT_URL}/storage/${file.name}`
  }

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
