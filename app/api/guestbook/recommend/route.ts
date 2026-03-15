import { NextRequest, NextResponse } from "next/server"

import { PgGuestBookRepository } from "@marimo/infrastructure/repositories/pg-guestbook-repository"

import { PrismaClient } from "@prisma/client"
import { PgUserRepository } from "@marimo/infrastructure/repositories"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"
import { GuestBookUsecase } from "@marimo/application/usecases/guest-book/guestbook-usecase"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = req.cookies
    const token = cookieStore.get("token")?.value

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

    const { users: recommendedUsers } =
      await guestbookUsecase.getRecommendUsers(user.id)

    return NextResponse.json({ recommendedUsers }, { status: 200 })
  } catch (error) {
    console.error(`GuestBook/[ownerId] API Post error -----> ${error}`)
    return NextResponse.json(
      { message: `GuestBook/[ownerId] API Post error -----> ${error}` },
      { status: 500 },
    )
  }
}
