import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { PgCouponRepository } from "@marimo/infrastructure/repositories/pg-coupon-repository"

import { PrismaClient } from "@prisma/client"
import { PgMarimoRepository } from "@marimo/infrastructure/repositories"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { CustomUsecase } from "@marimo/application/usecases/custom/custom-usecase"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const prisma = new PrismaClient()

  try {
    if (!token)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const userUsecase = new UserUsecase()
    const user = await userUsecase.getUser(token)

    if (!user)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const customUsecase = new CustomUsecase(
      new PgCouponRepository(prisma),
      new PgMarimoRepository(),
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
  const file = formData.get("image") as File | null

  if (!file) {
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
    )

    const src = await customUsecase.saveMarimoImage(file)

    return NextResponse.json({ src }, { status: 200 })
  } catch (error) {
    console.log(
      "=================== here custom post 500 error ===================",
    )
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

    const userUsecase = new UserUsecase()
    const user = await userUsecase.getUser(token)

    if (!user)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const { marimo, coupon } = await request.json()

    if (user.id !== marimo.userId)
      return NextResponse.json({ message: "user not matched" }, { status: 400 })

    const customUsecase = new CustomUsecase(
      new PgCouponRepository(prisma),
      new PgMarimoRepository(),
    )

    const { marimo: updatedMarimo } = await customUsecase.updateCustom(
      marimo,
      coupon,
    )

    return NextResponse.json(updatedMarimo, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: `Custom PUT Error: ${error}` },
      { status: 500 },
    )
  }
}
