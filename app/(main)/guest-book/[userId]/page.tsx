import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { Aside } from "@marimo/app/(main)/guest-book/[userId]/_components/aside"
import { PostCard } from "@marimo/app/(main)/guest-book/[userId]/_components/post-card"
import { PostInput } from "@marimo/app/(main)/guest-book/[userId]/_components/post-input"
import { UserRecommend } from "@marimo/app/(main)/guest-book/[userId]/_components/user-recommend"

import styles from "@marimo/app/(main)/guest-book/[userId]/page.module.css"

import { error } from "console"
import { GuestBook, Marimo, User } from "@prisma/client"

const url = process.env.NEXT_URL

interface GuestBookPageProps {
  params: Promise<{ userId: number }>
}

const GuestBookPage = async ({ params }: GuestBookPageProps) => {
  const ownerId = (await params).userId

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const postCreate = async (formData: FormData) => {
    "use server"

    const content = formData.get("content") as string

    if (!ownerId || !content) {
      return
    }

    const response = await fetch(`${url}/api/guestbook/${ownerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify({
        content,
      }),
    })

    if (!response.ok) {
      console.error(
        `response = await fetch(${url}/api/guestbook/${ownerId} error ${error}`,
      )
    }

    redirect(`${url}/guest-book/${ownerId}`)
  }

  const response = await fetch(`${url}/api/guestbook/${ownerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    mode: "cors",
    credentials: "same-origin",
  })

  if (!response.ok) {
    console.error(
      `response = await fetch(${url}/api/guestbook/${ownerId} get posts error ${error}`,
    )
  }

  const result = await response.json()

  const { owner, marimo, posts } = result

  const { guest_book__container, aside__div, post_list__div, post_list__ul } =
    styles
  return (
    <div className={guest_book__container}>
      <div className={aside__div}>
        <Aside owner={owner} ownerMarimo={marimo} />
        <UserRecommend />
      </div>
      <div className={post_list__div}>
        <PostInput postCreate={postCreate} />
        <ul className={post_list__ul}>
          {(posts ?? []).map(
            (
              post: GuestBook & {
                guest: User & { marimos: Marimo[] }
              },
              index: number,
            ) => (
              <PostCard
                key={index}
                user={post.guest}
                marimo={post.guest.marimos[0]}
                post={post}
              />
            ),
          )}
        </ul>
      </div>
    </div>
  )
}

export default GuestBookPage
