import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const usecase = new UserUsecase()

  const user = await usecase.getUser(token)

  if (!user || user === null)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  return NextResponse.json({ user }, { status: 200 })
}
