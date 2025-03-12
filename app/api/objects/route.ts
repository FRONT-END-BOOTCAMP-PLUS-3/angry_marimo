import { NextRequest, NextResponse } from "next/server"

import { PgObjectRepository } from "@marimo/infrastructure/repositories/pg-object-repository"

import { PrismaClient } from "@prisma/client"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

export async function GET(request: NextRequest) {
  try {
    const marimoId = Number(request.nextUrl.searchParams.get("marimoId"))

    if (!marimoId) {
      return NextResponse.json(
        { error: "Missing marimoID data" },
        { status: 404 },
      )
    }
    const objectRepository = new PgObjectRepository(new PrismaClient())
    const activeObject = await objectRepository.findAllByMarimoId(marimoId)

    return NextResponse.json({ activeObject }, { status: 200 })
  } catch (error) {
    console.error("❌ [오류 발생] Error handling request:", error)
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
  }
}
export async function POST(request: NextRequest) {
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
    const { marimoId, trashData } = body
    if (!marimoId || !trashData) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 },
      )
    }

    const { type, rect, isActive, url, level } = trashData
    if (!type || !rect || !isActive || !url || !level) {
      return NextResponse.json(
        { error: "Invalid trash data format" },
        { status: 400 },
      )
    }

    const usecase = new TrashToObjectUseCase(
      new PgObjectRepository(new PrismaClient()),
    )
    const objectItem = await usecase.execute(
      type,
      rect,
      isActive,
      url,
      level,
      marimoId,
    )

    return NextResponse.json({ objectItem }, { status: 200 })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    const repository = new PgObjectRepository(new PrismaClient())
    const existingObject = await repository.update(id)

    if (!existingObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update object" },
      { status: 500 },
    )
  }
}
