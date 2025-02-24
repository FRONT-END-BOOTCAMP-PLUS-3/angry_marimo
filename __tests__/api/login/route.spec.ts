import { NextRequest } from "next/server"

import { POST } from "@marimo/app/api/login/route"
import { test, vi, expect, beforeEach, afterEach } from "vitest"
import { LoginUsecase } from "@marimo/application/usecases/auth/login-usecase"

beforeEach(() => {
  vi.mock("@marimo/application/usecases/auth/login-usecase", () => ({
    LoginUsecase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  }))

  vi.mock("@marimo/infrastructure/repositories", () => ({
    PgAuthRepository: vi.fn(),
    PgUserRepository: vi.fn(),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

test("이메일 또는 비밀번호가 없으면 400 상태와 실패 메시지를 반환한다", async () => {
  const request = {
    json: vi.fn().mockResolvedValue({ email: "", password: "" }), // 이메일과 비밀번호가 없는 경우
  } as unknown as NextRequest

  const response = await POST(request)

  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({
    message: "이메일, 비밀번호를 입력해주세요.",
  })
})

test("유효하지 않은 이메일/비밀번호로 로그인 시 303 상태와 실패 메시지를 반환한다", async () => {
  const request = {
    json: vi.fn().mockResolvedValue({
      email: "invalid@example.com",
      password: "wrongpassword",
    }), // 유효하지 않은 이메일/비밀번호
  } as unknown as NextRequest

  const usecaseMock = {
    execute: vi.fn().mockRejectedValueOnce(new Error("isNotComparePassword")), // 로그인 실패 시 오류 반환
  }

  vi.mocked(LoginUsecase).mockReturnValue(usecaseMock)

  const response = await POST(request)

  expect(response.status).toBe(303) // 303 상태 코드
  expect(await response.json()).toEqual({ message: "isNotComparePassword" })
})

test("로그인 성공 시 200 상태와 사용자 정보를 반환한다", async () => {
  const request = {
    json: vi.fn().mockResolvedValue({
      email: "test@example.com",
      password: "correctpassword",
    }), // 올바른 이메일/비밀번호
  } as unknown as NextRequest

  const authenticatedMember = { id: 1, name: "John Doe", token: "valid-token" }

  const usecaseMock = {
    execute: vi.fn().mockResolvedValueOnce(authenticatedMember), // 로그인 성공 시 성공적인 반환
  }

  // LoginUsecase를 모킹하여 인스턴스를 반환
  vi.mocked(LoginUsecase).mockReturnValue(usecaseMock)

  const response = await POST(request)

  expect(response.status).toBe(200) // 200 상태 코드
  expect(await response.json()).toEqual(authenticatedMember)
})

test("알 수 없는 오류가 발생했을 경우 500 상태와 오류 메시지를 반환한다", async () => {
  const request = {
    json: vi.fn().mockResolvedValue({
      email: "test@example.com",
      password: "correctpassword",
    }), // 올바른 이메일/비밀번호
  } as unknown as NextRequest

  // LoginUsecase 모킹
  const usecaseMock = {
    execute: vi.fn().mockRejectedValueOnce(new Error("Unexpected error")), // 예상치 못한 오류를 던짐
  }

  // LoginUsecase를 모킹하여 인스턴스를 반환
  vi.mocked(LoginUsecase).mockReturnValue(usecaseMock)

  const response = await POST(request)

  expect(response.status).toBe(500) // 500 상태 코드
  expect(await response.json()).toEqual({
    message: "Login Error: Error: Unexpected error",
  })
})
