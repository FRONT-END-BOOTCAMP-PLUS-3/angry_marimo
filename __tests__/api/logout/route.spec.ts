import { test, expect, vi } from "vitest"
import { GET } from "@marimo/app/api/logout/route"

// NextResponse의 cookies.set을 감지할 수 있도록 모킹
vi.mock("next/server", () => {
  const cookies = {
    set: vi.fn(),
  }

  return {
    NextResponse: {
      json: vi.fn((data) => ({ ...data, cookies })),
    },
  }
})

test("로그아웃 API는 JSON 응답을 반환해야 한다", async () => {
  const response = await GET()

  expect(response).toHaveProperty("message", "Logged out")
})

test("로그아웃 시 토큰 쿠키가 삭제되어야 한다", async () => {
  const response = await GET()

  expect(response.cookies.set).toHaveBeenCalledWith(
    "token",
    "",
    expect.objectContaining({
      expires: expect.any(Date),
      path: "/",
    }),
  )
})
