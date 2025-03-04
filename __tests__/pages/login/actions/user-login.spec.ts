import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { userLogin } from "@marimo/app/login/actions/user-login"

import { generateJWT } from "@marimo/utils/jwt"

import { vi, test, expect, beforeEach, afterEach } from "vitest"

global.fetch = vi.fn()

beforeEach(() => {
  vi.mock("@marimo/utils/jwt", () => ({
    generateJWT: vi.fn(),
  }))

  vi.mock("next/headers", () => ({
    cookies: vi.fn(),
  }))

  vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
  }))
})

afterEach(() => {
  vi.clearAllMocks() // 각 테스트 후 모킹된 함수들을 초기화
})

// 테스트 시작
test("유효한 자격 증명으로 로그인하고 쿠키를 설정해야 한다", async () => {
  const formData = new FormData()
  formData.append("email", "test@example.com")
  formData.append("password", "password123")

  const userResponse = {
    id: "123",
    email: "test@example.com",
  }

  // fetch 응답 모킹
  fetch.mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockResolvedValueOnce(userResponse),
  })

  // JWT 생성 모킹
  generateJWT.mockReturnValue("fake-jwt-token")

  // cookies() 모킹을 비동기로 설정
  const mockCookieStore = {
    set: vi.fn(),
  }
  cookies.mockResolvedValueOnce(mockCookieStore)

  await userLogin(formData)

  expect(process.env.NEXT_URL).toBe("/")

  // fetch가 올바르게 호출되었는지 확인
  expect(fetch).toHaveBeenCalledWith(
    `${process.env.NEXT_PUBLIC_URL}/api/login`,
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    }),
  )

  // 쿠키가 올바르게 설정되었는지 확인
  expect(mockCookieStore.set).toHaveBeenCalledWith(
    "token",
    "fake-jwt-token",
    expect.objectContaining({
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }),
  )

  // 리디렉션이 홈 페이지로 호출되었는지 확인
  expect(redirect).toHaveBeenCalledWith("/")
})

test("로그인 실패 시 로그인 페이지로 리디렉션해야 한다", async () => {
  const formData = new FormData()
  formData.append("email", "test@example.com")
  formData.append("password", "wrongpassword")

  fetch.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: vi.fn().mockResolvedValueOnce({ message: "Unauthorized" }),
  })

  await userLogin(formData)

  // 리디렉션이 올바른 상태 코드와 함께 호출되었는지 확인
  expect(redirect).toHaveBeenCalledWith("/login?status=401")
})

test("이메일 또는 비밀번호가 없으면 아무 동작도 하지 않아야 한다", async () => {
  const formData = new FormData()

  // 이메일이 없는 경우
  await userLogin(formData)
  expect(fetch).not.toHaveBeenCalled()

  formData.append("email", "test@example.com")

  // 비밀번호가 없는 경우
  await userLogin(formData)
  expect(fetch).not.toHaveBeenCalled()
})
