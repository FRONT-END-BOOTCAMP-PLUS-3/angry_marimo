import { NextRequest, NextResponse } from "next/server"

import { PgMarimoRepository } from "@marimo/infrastructure/repositories"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"

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

  const usecase = new MarimoUsecase(new PgMarimoRepository())
  const user = await usecase.ensureAliveMarimo(userId)

  if (!user || user === null)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  return NextResponse.json({ user }, { status: 200 })
}
