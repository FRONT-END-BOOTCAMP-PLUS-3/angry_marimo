import { NextRequest, NextResponse } from "next/server"

import { LoginUsecase } from "@marimo/application/usecases/auth/login-usecase"
import {
  PgAuthRepository,
  PgUserRepository,
} from "@marimo/infrastructure/repositories"

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 데이터 추출
    const { email, password } = await request.json()

    // 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일, 비밀번호를 입력해주세요." },
        { status: 400 },
      )
    }

    const usecase = new LoginUsecase(
      new PgUserRepository(),
      new PgAuthRepository(),
    )

    const authenticatedMember = await usecase.execute({ email, password })

    // 응답 반환
    return NextResponse.json(authenticatedMember, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === "isNotComparePassword") {
      return NextResponse.json(
        { message: "isNotComparePassword" },
        { status: 303 },
      )
    }
    return NextResponse.json(
      { message: `Login Error: ${error}` },
      { status: 500 },
    )
  }
}
