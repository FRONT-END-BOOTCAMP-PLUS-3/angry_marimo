import { hashPassword, comparePassword } from "@marimo/utils/hash-password"

import { describe, test, expect, beforeAll } from "vitest" // 파일 경로를 실제 경로에 맞게 수정하세요

// 테스트 실행 전에 SECRET_KEY 환경 변수를 설정합니다.
beforeAll(() => {
  process.env.MARIMO_SECRET_KEY = "testsecret"
})

describe("Password Hashing and Comparison", () => {
  test("should generate a hashed password that is not the same as the plain text", () => {
    const password = "password123"
    const hashed = hashPassword(password)

    // 해시된 비밀번호와 해시 전 비밀번호가 다른지
    expect(hashed).not.toBe(password)
    expect(hashed).toBeTruthy()
  })

  test("should return true for correct password comparison", () => {
    const password = "password123"
    const hashed = hashPassword(password)

    // 올바른 비밀번호로 비교시 true를 반환
    expect(comparePassword(password, hashed)).toBe(true)
  })

  test("should return false for incorrect password comparison", () => {
    const password = "password123"
    const wrongPassword = "wrongpassword"
    const hashed = hashPassword(password)

    // 잘못된 비밀번호로 비교시 false를 반환
    expect(comparePassword(wrongPassword, hashed)).toBe(false)
  })
})
