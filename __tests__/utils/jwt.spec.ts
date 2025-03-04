import { generateJWT, verifyJWT } from "@marimo/utils/jwt"

import jwt from "jsonwebtoken"
import { describe, it, expect, beforeAll } from "vitest"

// 테스트 실행 전에 SECRET_KEY 환경 변수를 설정
beforeAll(() => {
  process.env.MARIMO_SECRET_KEY = "testsecret"
})

describe("JWT Generation and Verification", () => {
  it("should generate a valid JWT token", () => {
    const id = 1
    const email = "test@example.com"
    const token = generateJWT(id, email)

    expect(typeof token).toBe("string")

    // jwt 모듈로 직접 토큰을 검증하여 payload 내용이 일치하는지 확인
    const decoded = jwt.verify(token, process.env.MARIMO_SECRET_KEY!)
    expect(decoded).toHaveProperty("id", id)
    expect(decoded).toHaveProperty("email", email)
  })

  it("should verify a valid JWT token", () => {
    const id = 2
    const email = "user@example.com"
    const token = generateJWT(id, email)
    const decoded = verifyJWT(token)

    expect(decoded).not.toBeNull()
    if (decoded && typeof decoded === "object") {
      expect(decoded).toHaveProperty("id", id)
      expect(decoded).toHaveProperty("email", email)
    }
  })

  it("should return null for an invalid JWT token", () => {
    const invalidToken = "invalid.token"
    const decoded = verifyJWT(invalidToken)
    expect(decoded).toBeNull()
  })
})
