import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { PgCouponRepository } from "@marimo/infrastructure/repositories/pg-coupon-repository"
import { PgMarimoImageRepository } from "@marimo/infrastructure/repositories/pg-marimo-image-repository"

import { PrismaClient } from "@prisma/client"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { CustomUsecase } from "@marimo/application/usecases/custom/custom-usecase"
import {
  PgMarimoRepository,
  PgUserRepository,
} from "@marimo/infrastructure/repositories"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  try {
    if (!token)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const userUsecase = new UserUsecase(
      new PgUserRepository(new PrismaClient()),
    )
    const user = await userUsecase.getUser(token)

    if (!user)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const customUsecase = new CustomUsecase(
      new PgCouponRepository(new PrismaClient()),
      new PgMarimoRepository(),
      new PgMarimoImageRepository(new PrismaClient()),
    )

    const data = await customUsecase.getData(user.id)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: `Custom Get Error: ${error}` },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()

  const formData = await request.formData()

  const angry = formData.get("angry") as File | null
  const leftTwerk = formData.get("leftTwerk") as File | null
  const rightTwerk = formData.get("rightTwerk") as File | null
  const dead = formData.get("dead") as File | null

  if (!angry || !leftTwerk || !rightTwerk || !dead) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  try {
    const customUsecase = new CustomUsecase(
      new PgCouponRepository(prisma),
      new PgMarimoRepository(),
      new PgMarimoImageRepository(new PrismaClient()),
    )

    const images = await customUsecase.saveMarimoImage(
      angry,
      leftTwerk,
      rightTwerk,
      dead,
    )

    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: `Custom Post Error: ${error}` },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  const prisma = new PrismaClient()

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const userUsecase = new UserUsecase(
      new PgUserRepository(new PrismaClient()),
    )
    const user = await userUsecase.getUser(token)

    if (!user)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const { marimo, marimoImages, coupon } = await request.json()

    if (user.id !== marimo.userId)
      return NextResponse.json({ message: "user not matched" }, { status: 400 })

    const customUsecase = new CustomUsecase(
      new PgCouponRepository(prisma),
      new PgMarimoRepository(),
      new PgMarimoImageRepository(new PrismaClient()),
    )

    const { images } = await customUsecase.updateCustom(
      marimo,
      marimoImages,
      coupon,
    )

    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: `Custom PUT Error: ${error}` },
      { status: 500 },
    )
  }
}
