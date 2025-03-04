import { verifyJWT } from "@marimo/utils/jwt"

import { test, vi, expect } from "vitest"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"

vi.mock("@marimo/utils/jwt", () => ({
  verifyJWT: vi.fn(),
}))

test("유효한 JWT 토큰을 제공하면 사용자 정보를 반환한다", async () => {
  const token = "valid-token"
  const user = { id: 1, email: "john.doe@example.com" }

  vi.mocked(verifyJWT).mockReturnValue(user)

  const userUsecase = new UserUsecase()

  const result = await userUsecase.getUser(token)

  expect(result).toEqual({
    id: 1,
    name: "john.doe",
    email: "john.doe@example.com",
  })
})

test("유효하지 않은 JWT 토큰을 제공하면 null을 반환한다", async () => {
  const token = "invalid-token"

  vi.mocked(verifyJWT).mockReturnValue(null)

  const userUsecase = new UserUsecase()

  const result = await userUsecase.getUser(token)

  expect(result).toBeNull()
})
