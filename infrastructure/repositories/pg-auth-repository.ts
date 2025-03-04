import { AuthRepository } from "@marimo/domain/repositories/auth-repository"

import { hashPassword } from "@marimo/utils/hash-password"

import { PrismaClient, User } from "@prisma/client"

export class PgAuthRepository implements AuthRepository {
  async signUp(email: string, password: string): Promise<User> {
    const prisma = new PrismaClient()

    const hashedPassword = hashPassword(password)

    try {
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      })

      return user
    } catch (error: any) {
      if (error.code === "P2002") {
        // 이메일이 이미 존재하는 경우
        throw new Error("이메일이 이미 존재합니다.")
      } else {
        throw new Error("회원가입 실패:", error)
      }
    } finally {
      await prisma.$disconnect()
    }
  }
}
