import { PgUserRepository } from "@marimo/infrastructure/repositories/pg-user-repository"

import { PrismaClient } from "@prisma/client"
import { test, expect, vi, Mock } from "vitest"

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
    },
  }
  return { PrismaClient: vi.fn(() => mockPrisma) }
})

const mockPrisma = new PrismaClient()
const findUnique = mockPrisma.user.findUnique as Mock

test("findByEmail 메서드가 정상적으로 작동하는지 테스트", async () => {
  const mockEmail = "test@example.com"
  const mockUser = { id: 1, email: mockEmail, name: "John Doe" }

  findUnique.mockResolvedValueOnce(mockUser)

  const pgUserRepo = new PgUserRepository()

  const result = await pgUserRepo.findByEmail(mockEmail)

  expect(result).toEqual(mockUser)
  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
    where: { email: mockEmail },
  })
})

test("findByEmail 메서드가 사용자 없을 때 null을 반환하는지 테스트", async () => {
  const mockEmail = "nonexistent@example.com"

  // Prisma 클라이언트의 user.findUnique가 null을 반환하도록 설정
  const mockPrisma = new PrismaClient()
  findUnique.mockResolvedValueOnce(null)

  const pgUserRepo = new PgUserRepository()
  const result = await pgUserRepo.findByEmail(mockEmail)

  expect(result).toBeNull()
  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
    where: { email: mockEmail },
  })
})

test("findById 메서드가 정상적으로 작동하는지 테스트", async () => {
  const mockId = 1
  const mockUser = { id: mockId, email: "test@example.com", name: "John Doe" }

  const mockPrisma = new PrismaClient()
  findUnique.mockResolvedValueOnce(mockUser)

  const pgUserRepo = new PgUserRepository()

  const result = await pgUserRepo.findById(mockId)

  expect(result).toEqual(mockUser)
  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
    where: { id: mockId },
  })
})

test("findById 메서드가 사용자 없을 때 null을 반환하는지 테스트", async () => {
  const mockId = 99

  const mockPrisma = new PrismaClient()
  findUnique.mockResolvedValueOnce(null)

  const pgUserRepo = new PgUserRepository()
  const result = await pgUserRepo.findById(mockId)

  expect(result).toBeNull()
  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
    where: { id: mockId },
  })
})
