import { NextResponse, NextRequest } from "next/server"

import { PrismaClient } from "@prisma/client"
import { MarimoRepository, ObjectRepository } from "@marimo/domain/repositories"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"
import {
  PgMarimoRepository,
  PgObjectRepository,
} from "@marimo/infrastructure/repositories"

const marimoRepository: MarimoRepository = new PgMarimoRepository()
const objectRepository: ObjectRepository = new PgObjectRepository(
  new PrismaClient(),
)
const marimoUsecase = new MarimoUsecase(marimoRepository, objectRepository)

export async function POST(req: NextRequest) {
  const marimoData = await req.json()
  const marimoId = marimoData.id

  if (!marimoId) {
    console.error("Marimo ID is missing in the request body")
    // Using NextResponse for custom response manipulation
    return NextResponse.json(
      { message: "Marimo ID is required" },
      { status: 400 },
    )
  }

  console.log("Extracted Marimo ID from marimoData:", marimoId)

  try {
    const updatedMarimo = await marimoUsecase.updateMarimo(marimoData)
    // Successfully return the updated Marimo
    return NextResponse.json(updatedMarimo, { status: 200 })
  } catch (error) {
    console.error("Failed to update marimo:", error)
    // Return an error response using NextResponse
    return NextResponse.json(
      {
        message: "Failed to update marimo",
        error,
      },
      { status: 500 },
    )
  }
}
