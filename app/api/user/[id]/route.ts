import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from "@prisma/client"
import { PgUserRepository } from "@marimo/infrastructure/repositories"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params
  const ownerId = Number(resolvedParams.id)

  const usecase = new UserUsecase(new PgUserRepository(new PrismaClient()))

  const user = await usecase.getUserById(ownerId)

  if (!user || user === null)
    return NextResponse.json(
      { message: "Can't find owner user" },
      { status: 400 },
    )

  return NextResponse.json({ user }, { status: 200 })
}
