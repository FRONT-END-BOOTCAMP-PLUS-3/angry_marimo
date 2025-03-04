import { verifyJWT } from "@marimo/utils/jwt"

import { UserGetDto } from "@marimo/application/usecases/auth/dto"

export class UserUsecase {
  async getUser(token: string): Promise<UserGetDto | null> {
    const user = verifyJWT(token) as UserGetDto

    if (!user) return null

    return {
      id: user?.id,
      name: user?.email.split("@")[0],
      email: user?.email,
    } as UserGetDto
  }
}
