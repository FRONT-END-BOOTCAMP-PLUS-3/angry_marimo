import { NextRequest, NextResponse } from "next/server"

import { PgGuestBookRepository } from "@marimo/infrastructure/repositories/pg-guestbook-repository"

import { PrismaClient } from "@prisma/client"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"
import { GuestBookUsecase } from "@marimo/application/usecases/guest-book/guestbook-usecase"
import {
  PgMarimoRepository,
  PgObjectRepository,
  PgUserRepository,
} from "@marimo/infrastructure/repositories"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> },
) {
  const cookieStore = req.cookies
  const token = cookieStore.get("token")?.value

  const resolvedParams = await params
  const ownerId = Number(resolvedParams.ownerId)

  try {
    if (!token)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const userUsecase = new UserUsecase(
      new PgUserRepository(new PrismaClient()),
    )
    const user = await userUsecase.getUser(token)

    if (!user || user === null)
      return NextResponse.json({ message: "login failed" }, { status: 401 })

    const guestbookUsecase = new GuestBookUsecase(
      new PgGuestBookRepository(new PrismaClient()),
      new PgUserRepository(new PrismaClient()),
    )

    const data = await req.json()
    const { content } = data

    if (!content || content === "") NextResponse.json({ status: 400 })

    const post = await guestbookUsecase.excuse(ownerId, user.id, content)

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error(`GuestBook/[ownerId] API Post error -----> ${error}`)
    return NextResponse.json(
      { message: `GuestBook/[ownerId] API Post error -----> ${error}` },
      { status: 500 },
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> },
) {
  const resolvedParams = await params
  const ownerId = Number(resolvedParams.ownerId)

  try {
    const userUsecase = new UserUsecase(
      new PgUserRepository(new PrismaClient()),
    )
    const owner = await userUsecase.getUserById(ownerId)

    if (!owner)
      return NextResponse.json({ message: "owner not found" }, { status: 400 })

    const marimoUsecase = new MarimoUsecase(
      new PgMarimoRepository(),
      new PgObjectRepository(new PrismaClient()),
    )

    const marimo = await marimoUsecase.ensureAliveMarimo(owner.id)

    const guestbookUsecase = new GuestBookUsecase(
      new PgGuestBookRepository(new PrismaClient()),
      new PgUserRepository(new PrismaClient()),
    )

    const { posts } = await guestbookUsecase.getAllByOwnerId(ownerId)

    return NextResponse.json({ owner, marimo, posts }, { status: 200 })
  } catch (error) {
    console.error(`GuestBook/[ownerId] API Post error -----> ${error}`)
    return NextResponse.json(
      { message: `GuestBook/[ownerId] API Post error -----> ${error}` },
      { status: 500 },
    )
  }
}
