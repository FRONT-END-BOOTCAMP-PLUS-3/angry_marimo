import { NextRequest, NextResponse } from "next/server"

import { PgObjectRepository } from "@marimo/infrastructure/repositories/pg-object-repository"

import { PrismaClient } from "@prisma/client"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

const prisma = new PrismaClient()

export async function GET() {
  const response = NextResponse.json({ message: "쓰레기를 생성합니다." })
  response.ok
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 },
      )
    }

    const body = await request.text()
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const { marimoId, trashData } = JSON.parse(body)
    console.log("marimoId 랑 trashData 확인용 -------> ", marimoId, trashData)

    if (!marimoId || !Array.isArray(trashData)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    // UseCase 실행
    const usecase = new TrashToObjectUseCase(new PgObjectRepository(prisma))
    const resultData = await usecase.execute(trashData, marimoId)

    console.log("🔄 변환된 데이터:", resultData)
    if (Array.isArray(resultData)) {
      await prisma.object.createMany({ data: resultData })
    } else {
      await prisma.object.create({ data: resultData })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("❌ JSON parsing error:", error)
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
  }
}
