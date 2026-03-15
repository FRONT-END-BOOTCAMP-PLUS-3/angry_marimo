import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from "@prisma/client"
import { PgMarimoImageRepository } from "@marimo/infrastructure/repositories"
import { MarimoImageUsecase } from "@marimo/application/usecases/marimo/marimo-image-usecase"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marimoId: string }> },
) {
  const cookieStore = req.cookies
  const token = cookieStore.get("token")?.value

  const resolvedParams = await params
  const marimoId = Number(resolvedParams.marimoId)

  try {
    if (!token)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const marimoImageUsecase = new MarimoImageUsecase(
      new PgMarimoImageRepository(new PrismaClient()),
    )

    const images = await marimoImageUsecase.getMarimoImageByMarimoId(marimoId)

    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error(`Marimo/images/[marimoId] API Get error -----> ${error}`)
    return NextResponse.json(
      { message: `Marimo/images/[marimoId] API Get error -----> ${error}` },
      { status: 500 },
    )
  }
}
