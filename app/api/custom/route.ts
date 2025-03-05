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

// TODO : 마리모 커스텀 하는 route
// [ ] : 마리모 이름을 업데이트 해야한다
// [ ] : 마리모 이미지를 저장하고 src 주소를 업데이트 해야한다
// [ ] : 티켓 사용 완료로 변경
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  try {
    const { marimoId, name, color } = await request.json()

    console.table({ marimoId, name, color })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: `Custom Post Error: ${error}` },
      { status: 500 },
    )
  }
}
