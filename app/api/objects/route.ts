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
    console.log("Received request headers:", request.headers)

    if (request.headers.get("content-type") !== "application/json") {
      console.error(
        "Invalid content-type:",
        request.headers.get("content-type"),
      )
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 },
      )
    }

    const body = await request.text()
    console.log("Received request body:", body)

    if (!body) {
      console.error("Empty request body")
      return NextResponse.json({ error: "Empty request body" }, { status: 400 })
    }

    const data = JSON.parse(body)
    console.log("Parsed data:", data)

    const { marimoId, trashData } = data
    if (!marimoId || !trashData) {
      console.error("Missing required data:", { marimoId, trashData })
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 },
      )
    }

    const { type, rect, isActive, url, level } = trashData
    if (!type || !rect || !isActive || !url || !level) {
      console.error("Invalid trash data format:", trashData)
      return NextResponse.json(
        { error: "Invalid trash data format" },
        { status: 400 },
      )
    }

    const usecase = new TrashToObjectUseCase(new PgObjectRepository(prisma))
    await usecase.execute(type, rect, isActive, url, level, marimoId)
    console.log("Trash data processed successfully:", {
      type,
      rect,
      isActive,
      url,
      level,
      marimoId,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error handling request:", error)
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
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

    const { id, marimoId, isActive, updatedAt } = body
    if (!id || !marimoId || !updatedAt || !isActive) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    const repository = new PgObjectRepository(prisma)
    const existingObject = await repository.findById(id)

    if (!existingObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 })
    }

    await repository.update(marimoId, isActive, updatedAt)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("❌ Update error:", error)
    return NextResponse.json(
      { error: "Failed to update object" },
      { status: 500 },
    )
  }
}
