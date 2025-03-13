import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from "@prisma/client"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"
import {
  PgMarimoRepository,
  PgObjectRepository,
  PgUserRepository,
} from "@marimo/infrastructure/repositories"

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies
  const token = cookieStore.get("token")?.value

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const userUsecase = new UserUsecase(new PgUserRepository(new PrismaClient()))

  const user = await userUsecase.getUser(token)

  if (!user)
    return NextResponse.json({ message: "user not found" }, { status: 403 })

  const marimoUsecase = new MarimoUsecase(
    new PgMarimoRepository(),
    new PgObjectRepository(new PrismaClient()),
  )

  const marimo = await marimoUsecase.ensureAliveMarimo(user.id)

  return NextResponse.json(marimo, { status: 200 })
}
