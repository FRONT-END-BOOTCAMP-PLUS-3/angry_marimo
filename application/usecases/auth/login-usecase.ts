import { UserRepository } from "@marimo/domain/repositories/user-repository"

import { comparePassword } from "@marimo/utils/hash-password"

import { AuthRepository } from "@marimo/domain/repositories"
import {
  UserLoginDto,
  UserAuthenticatedDto,
} from "@marimo/application/usecases/auth/dto"

export class LoginUsecase {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
  ) {}

  async execute({
    email,
    password,
  }: UserLoginDto): Promise<UserAuthenticatedDto> {
    const existUser = await this.userRepository.findByEmail(email)
    const user =
      existUser !== null
        ? existUser
        : await this.authRepository.signUp(email, password)

    const isComparePassword = comparePassword(password, user?.password)
    if (!isComparePassword) throw new Error("isNotComparePassword")

    const authenticatedUser = {
      id: user.id,
      name: user.email.split("@")[0],
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return authenticatedUser
  }
}
