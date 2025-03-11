import { NextRequest, NextResponse } from "next/server"

import { PgObjectRepository } from "@marimo/infrastructure/repositories/pg-object-repository"

import { PrismaClient } from "@prisma/client"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

// get 에서 isActive 가 true 인 객체들만 가져옴.-> test 필요
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "쓰레기를 생성합니다." })
    console.log("response.ok ", response.ok)

    const body = await request.json()
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const { marimoId } = body
    if (!marimoId) {
      return NextResponse.json(
        { error: "Missing marimoID data" },
        { status: 400 },
      )
    }
    const objectRepository = new PgObjectRepository(new PrismaClient())
    const activeObject = objectRepository.findAllByMarimoId(marimoId)

    return NextResponse.json({ activeObject }, { status: 200 })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     if (request.headers.get("Content-type") !== "application/json") {
//       return NextResponse.json(
//         { error: "Invalid Content-Type" },
//         { status: 400 },
//       )
//     }
//     const body = await request.json()
//     if (!body) {
//       return NextResponse.json({ error: "Empty request body" }, { status: 400 })
//     }

//     const { marimoId, trashData } = body
//     if (!marimoId || !trashData) {
//       return NextResponse.json(
//         { error: "Missing required data" },
//         { status: 400 },
//       )
//     }

//     const { type, rect, isActive, url, level } = trashData
//     if (!type || !rect || !isActive || !url || !level) {
//       return NextResponse.json(
//         { error: "Invalid trash data format" },
//         { status: 400 },
//       )
//     }

//     const usecase = new TrashToObjectUseCase(
//       new PgObjectRepository(new PrismaClient()),
//     )
//     const objectItem = await usecase.execute(
//       type,
//       rect,
//       isActive,
//       url,
//       level,
//       marimoId,
//     )

//     return NextResponse.json({ objectItem }, { status: 200 })
//   } catch (error) {
//     console.error("Error handling request:", error)
//     return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
//   }
// }

export async function POST(request: NextRequest) {
  /*
  { 이런식으로 데이터 보내면 됨. - 확인 완료
  "marimoId": 29,
  "trashItems": [
    {
      "type": "trash",
      "rect": { "x": 100, "y": 200 },
      "isActive": true,
      "url": "image1.jpeg",
      "level": 1
    },
    {
      "type": "trash",
      "rect": { "x": 300, "y": 400 },
      "isActive": true,
      "url": "image2.jpeg",
      "level": 2
    }
  ]
}
   */
  try {
    if (request.headers.get("Content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 },
      )
    }

    const body = await request.json()
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const { marimoId, trashItems } = body
    if (!marimoId || !Array.isArray(trashItems) || trashItems.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid trashItems array" },
        { status: 400 },
      )
    }

    const usecase = new TrashToObjectUseCase(
      new PgObjectRepository(new PrismaClient()),
    )

    const objectItems = await usecase.executeAll(marimoId, trashItems)

    return NextResponse.json({ objectItems }, { status: 200 })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "Server error" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 },
      )
    }

    const body = await request.json()
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const { id, isActive, updatedAt } = body
    if (!id || !updatedAt || !isActive) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    const repository = new PgObjectRepository(new PrismaClient())
    const existingObject = await repository.update(id, isActive, updatedAt)

    if (!existingObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("❌ Update error:", error)
    return NextResponse.json(
      { error: "Failed to update object" },
      { status: 500 },
    )
  }
}
