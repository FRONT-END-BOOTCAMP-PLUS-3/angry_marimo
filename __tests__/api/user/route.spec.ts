import { cookies } from "next/headers"

import { GET } from "@marimo/app/api/user/route"
import { test, vi, expect, afterEach, beforeEach, Mock } from "vitest"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"

beforeEach(() => {
  // 모킹 설정
  vi.mock("next/headers", () => ({
    cookies: vi.fn(),
  }))

  vi.mock("@marimo/application/usecases/auth/user-usecase", () => ({
    UserUsecase: vi.fn().mockImplementation(() => ({
      getUser: vi.fn(),
    })),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

test("로그인 토큰이 없으면 401 상태와 실패 메시지를 반환한다", async () => {
  // cookies 함수 모킹
  ;(cookies as Mock).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue(undefined), // 토큰이 없을 때
  })

  const response = await GET()

  expect(response.status).toBe(401) // 401 상태 코드
  expect(await response.json()).toEqual({ message: "login failed" })
})

test("유효하지 않은 토큰일 경우 401 상태와 실패 메시지를 반환한다", async () => {
  // cookies 함수 모킹
  ;(cookies as Mock).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue({ value: "invalid-token" }), // 유효하지 않은 토큰
  })

  vi.mocked(UserUsecase).mockImplementationOnce(() => ({
    getUser: vi.fn().mockReturnValue(null),
  }))

  const response = await GET()

  expect(response.status).toBe(401) // 401 상태 코드
  expect(await response.json()).toEqual({ message: "login failed" })
})

test("유효한 토큰일 경우 200 상태와 사용자 정보를 반환한다", async () => {
  // cookies 함수 모킹
  ;(cookies as Mock).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue({ value: "valid-token" }), // 유효한 토큰
  })

  vi.mocked(UserUsecase).mockImplementationOnce(() => ({
    getUser: vi.fn().mockReturnValue({ id: 1, name: "John Doe" }),
  }))

  const response = await GET()

  expect(response.status).toBe(200) // 200 상태 코드
  expect(await response.json()).toEqual({
    user: { id: 1, name: "John Doe" },
  })
})
