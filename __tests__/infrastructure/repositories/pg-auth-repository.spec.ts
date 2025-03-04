import { PgAuthRepository } from "@marimo/infrastructure/repositories/pg-auth-repository"

import { hashPassword } from "@marimo/utils/hash-password"

import { PrismaClient } from "@prisma/client"
import { test, expect, vi, Mock } from "vitest"

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      create: vi.fn(),
    },
  }
  return { PrismaClient: vi.fn(() => mockPrisma) }
})

vi.mock("@marimo/utils/hash-password", () => ({
  hashPassword: vi.fn(),
}))

const mockPrisma = new PrismaClient()

const mockHashPassword = hashPassword as Mock
const create = mockPrisma.user.create as Mock

test("signUp 메서드가 정상적으로 작동하는지 테스트", async () => {
  // Prisma 클라이언트와 hashPassword 모킹 설정
  const mockEmail = "test@example.com"
  const mockPassword = "password123"
  const hashedPassword = "hashedPassword123"

  // hashPassword가 예상한 값을 반환하도록 설정
  mockHashPassword.mockReturnValueOnce(hashedPassword)

  // Prisma 클라이언트의 user.create 메서드가 정상적으로 작동하도록 설정
  create.mockResolvedValueOnce({
    id: 1,
    email: mockEmail,
    password: hashedPassword,
  })

  const pgAuthRepo = new PgAuthRepository()

  // signUp 호출
  const result = await pgAuthRepo.signUp(mockEmail, mockPassword)

  // 예상된 결과와 일치하는지 확인
  expect(result).toEqual({
    id: 1,
    email: mockEmail,
    password: hashedPassword,
  })

  // Prisma의 user.create가 호출되었는지 확인
  expect(mockPrisma.user.create).toHaveBeenCalledWith({
    data: { email: mockEmail, password: hashedPassword },
  })

  // hashPassword가 호출되었는지 확인
  expect(hashPassword).toHaveBeenCalledWith(mockPassword)
})

test("이메일이 이미 존재할 경우 예외를 던지는지 테스트", async () => {
  const mockEmail = "test@example.com"
  const mockPassword = "password123"
  const hashedPassword = "hashedPassword123"

  // hashPassword가 예상한 값을 반환하도록 설정
  mockHashPassword.mockReturnValueOnce(hashedPassword)

  // Prisma 클라이언트의 user.create가 오류를 던지도록 설정 (P2002 - 이메일 중복)
  create.mockRejectedValueOnce({
    code: "P2002",
    message: "Unique constraint failed on the fields: (`email`)",
  })

  const pgAuthRepo = new PgAuthRepository()

  // signUp 호출 시 이메일이 이미 존재하는 경우 예외 처리 확인
  await expect(pgAuthRepo.signUp(mockEmail, mockPassword)).rejects.toThrowError(
    "이메일이 이미 존재합니다.",
  )

  // hashPassword가 호출되었는지 확인
  expect(hashPassword).toHaveBeenCalledWith(mockPassword)
})

test("회원가입 실패 시 일반 오류가 던져지는지 테스트", async () => {
  const mockEmail = "test@example.com"
  const mockPassword = "password123"
  const hashedPassword = "hashedPassword123"

  // hashPassword가 예상한 값을 반환하도록 설정
  mockHashPassword.mockReturnValueOnce(hashedPassword)

  // Prisma 클라이언트의 user.create가 다른 오류를 던지도록 설정
  create.mockRejectedValueOnce(new Error("Unexpected error"))

  const pgAuthRepo = new PgAuthRepository()

  // 일반 오류가 던져지는지 확인
  await expect(pgAuthRepo.signUp(mockEmail, mockPassword)).rejects.toThrowError(
    "회원가입 실패:",
  )

  // hashPassword가 호출되었는지 확인
  expect(hashPassword).toHaveBeenCalledWith(mockPassword)
})
