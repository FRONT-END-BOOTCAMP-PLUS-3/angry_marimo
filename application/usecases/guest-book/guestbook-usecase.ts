import {
  GuestBookRepository,
  UserRepository,
} from "@marimo/domain/repositories"
import {
  excuseDto,
  getAllByOwnerIdDto,
  getRecommendUsersDto,
} from "@marimo/application/usecases/guest-book/dto"

export class GuestBookUsecase {
  constructor(
    private guestbookRepository: GuestBookRepository,
    private userRepository: UserRepository,
  ) {}

  async excuse(
    ownerId: number,
    guestId: number,
    content: string,
  ): Promise<excuseDto | null> {
    const newPost = {
      ownerId,
      guestId,
      content,
    }

    const post = await this.guestbookRepository.create(newPost)

    return { post }
  }

  async getAllByOwnerId(ownerId: number): Promise<getAllByOwnerIdDto> {
    const posts = await this.guestbookRepository.getAllPostByOwnerId(ownerId)

    return { posts }
  }

  async getRecommendUsers(id: number): Promise<getRecommendUsersDto> {
    const users = await this.userRepository.findUsersWithoutId(id)
    return { users }
  }
}
