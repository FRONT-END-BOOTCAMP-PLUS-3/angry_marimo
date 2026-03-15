import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from "@prisma/client"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"
import {
  PgMarimoRepository,
  PgObjectRepository,
} from "@marimo/infrastructure/repositories"

// 기존 마리모를 확인하고 있으면 반환, 아무 마리모도 없는 경우 새 마리모 생성
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const cookieStore = req.cookies
  const token = cookieStore.get("token")?.value

  const resolvedParams = await params
  const userId = Number(resolvedParams.userId)

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const usecase = new MarimoUsecase(
    new PgMarimoRepository(),
    new PgObjectRepository(new PrismaClient()),
  )
  const user = await usecase.ensureAliveMarimo(userId)

  if (!user || user === null)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  return NextResponse.json({ user }, { status: 200 })
}

// 새로운 마리모를 만드는 API
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const cookieStore = req.cookies
  const token = cookieStore.get("token")?.value

  const resolvedParams = await params
  const userId = Number(resolvedParams.userId)

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const usecase = new MarimoUsecase(
    new PgMarimoRepository(),
    new PgObjectRepository(new PrismaClient()),
  )
  const marimo = await usecase.createDefaultMarimo(userId)

  return NextResponse.json(marimo, { status: 200 })
}
