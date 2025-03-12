import { CouponRepository } from "@marimo/domain/repositories/coupon-repository"

import path from "path"
import fs from "fs/promises"
import { Coupon, Marimo, MarimoImage } from "@prisma/client"
import {
  MarimoImageRepository,
  MarimoRepository,
} from "@marimo/domain/repositories"
import {
  GetDataDto,
  PostImagesDto,
  UpdateCustomDto,
} from "@marimo/application/usecases/custom/dto"

export class CustomUsecase {
  constructor(
    private couponRepository: CouponRepository,
    private marimoRepository: MarimoRepository,
    private marimoImageRepository: MarimoImageRepository,
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

  async saveMarimoImage(
    angry: File,
    leftTwerk: File,
    rightTwerk: File,
    dead: File,
  ): Promise<PostImagesDto> {
    const storageDir = process.env.NEXT_STORAGE_SRC ?? "../storage"
    const resolvedPath = path.resolve(storageDir)

    await fs.mkdir(resolvedPath, { recursive: true })

    const imageFileArr = [angry, leftTwerk, rightTwerk, dead]

    await Promise.all(
      imageFileArr.map(async (file) => {
        const filePath = path.join(storageDir, file.name)
        const buffer = Buffer.from(await file.arrayBuffer())

        await fs.writeFile(filePath, buffer)
      }),
    )

    return {
      angry: `${process.env.NEXT_URL}/storage/${angry.name}`,
      leftTwerk: `${process.env.NEXT_URL}/storage/${leftTwerk.name}`,
      rightTwerk: `${process.env.NEXT_URL}/storage/${rightTwerk.name}`,
      dead: `${process.env.NEXT_URL}/storage/${dead.name}`,
    }
  }

  async updateCustom(
    marimo: Marimo,
    imageData: Omit<MarimoImage, "id" | "createdAt" | "updatedAt">,
    coupon: Coupon,
  ): Promise<UpdateCustomDto> {
    const newImages = {
      ...imageData,
      marimoId: marimo.id,
    }

    const createdImages =
      await this.marimoImageRepository.createImages(newImages)

    // await this.couponRepository.update(coupon.id)

    return { images: createdImages }
  }
}
