import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { PgCouponRepository } from "@marimo/infrastructure/repositories/pg-coupon-repository"

import { PrismaClient } from "@prisma/client"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { OrderUsecase } from "@marimo/application/usecases/pay/order-usecase"
import {
  PgOrderRepository,
  PgUserRepository,
} from "@marimo/infrastructure/repositories"

export async function GET() {
  const usecase = new OrderUsecase(
    new PgOrderRepository(new PrismaClient()),
    new PgCouponRepository(new PrismaClient()),
  )

  const amount = await usecase.getAllAmount()

  if (!amount)
    return NextResponse.json(
      { message: "잠시 후 다시 시도해주세요!" },
      { status: 400 },
    )

  return NextResponse.json(amount, { status: 200 })
}

export async function POST(request: NextRequest) {
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

    const orderUsecase = new OrderUsecase(
      new PgOrderRepository(new PrismaClient()),
      new PgCouponRepository(new PrismaClient()),
    )

    const {
      marimoId,
      amount,
      paymentKey,
      status = "READY",
      payResponse,
    } = await request.json()

    const order = await orderUsecase.excuse(
      user.id,
      marimoId,
      status,
      amount,
      paymentKey,
      payResponse,
    )

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: `Order create Error : ${error}` },
      { status: 500 },
    )
  }
}
