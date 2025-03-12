import { verifyJWT } from "@marimo/utils/jwt"

import { UserRepository } from "@marimo/domain/repositories"
import {
  UserGetByIdDto,
  UserGetDto,
} from "@marimo/application/usecases/auth/dto"

export class UserUsecase {
  constructor(private userRepository: UserRepository) {}

  async getUser(token: string): Promise<UserGetDto | null> {
    const user = verifyJWT(token) as UserGetDto

    if (!user) return null

    return {
      id: user?.id,
      name: user?.email.split("@")[0],
      email: user?.email,
    } as UserGetDto
  }

  async getUserById(id: number): Promise<UserGetByIdDto | null> {
    const user = await this.userRepository.findById(id)

    if (!user) throw new Error("유저 없음!")

    return {
      id: user?.id,
      name: user?.email.split("@")[0],
      email: user?.email,
      description: user.description,
    } as UserGetByIdDto
  }
}
