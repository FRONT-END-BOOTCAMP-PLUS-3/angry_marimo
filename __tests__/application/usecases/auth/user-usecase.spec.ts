import { verifyJWT } from "@marimo/utils/jwt"

import { vi, test, expect, Mock } from "vitest"
import { UserUsecase } from "@marimo/application/usecases/auth/user-usecase"

vi.mock("@marimo/utils/jwt", () => ({
  verifyJWT: vi.fn(),
}))

const mockVerifyJWT = verifyJWT as Mock

test("토큰이 유효하면 사용자 정보를 반환한다", async () => {
  const mockToken = "valid-token"
  const mockUser = {
    id: 1,
    email: "test@example.com",
  }

  mockVerifyJWT.mockReturnValueOnce(mockUser) // 유효한 토큰이 들어왔을 때

  const userUsecase = new UserUsecase()
  const result = await userUsecase.getUser(mockToken)

  expect(result).toEqual({
    id: 1,
    name: "test", // 이메일의 '@' 앞 부분이 이름으로 처리됨
    email: "test@example.com",
  })
})

test("토큰이 유효하지 않으면 null을 반환한다", async () => {
  const mockToken = "invalid-token"

  mockVerifyJWT.mockReturnValueOnce(null) // 토큰이 유효하지 않으면 null 반환

  const userUsecase = new UserUsecase()
  const result = await userUsecase.getUser(mockToken)

  expect(result).toBeNull() // null이 반환되어야 함
})

test("토큰에 사용자 정보가 없으면 null을 반환한다", async () => {
  const mockToken = "token-with-no-user"

  mockVerifyJWT.mockReturnValueOnce(null) // 토큰에 사용자가 없는 경우

  const userUsecase = new UserUsecase()
  const result = await userUsecase.getUser(mockToken)

  expect(result).toBeNull() // null이 반환되어야 함
})
