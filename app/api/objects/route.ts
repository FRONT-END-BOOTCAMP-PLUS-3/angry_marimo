import { NextRequest, NextResponse } from "next/server"

import { PgObjectRepository } from "@marimo/infrastructure/repositories/pg-object-repository"

import { PrismaClient } from "@prisma/client"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

export async function GET() {
  const response = NextResponse.json({ message: "쓰레기를 생성합니다." })
  response.ok
}

export async function POST(request: NextRequest) {
  const { marimoId, trashData } = await request.json()
  console.log("trashData ------->", trashData)

  const usecase = new TrashToObjectUseCase(
    new PgObjectRepository(new PrismaClient()),
  )

  try {
    // 200 response.Ok
    const trash = await usecase.execute(trashData, marimoId)

    if (!trash) {
      console.log("Marimo not found.")
      return NextResponse.json(
        { message: "Marimo not found." },
        { status: 404 },
      )
    }

    console.log("Marimo found:", trash)
    return NextResponse.json({ trash })
  } catch (error) {
    console.error("❌ Error in POST request:", error)

    return NextResponse.json(
      {
        message: "에러났다요-----------POST 요청에서 에러임~>",
        error: error,
      },
      { status: 500 },
    )
  }
}
