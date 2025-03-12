"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

import { getRandomElements } from "@marimo/utils/get-random-elements"

import styles from "@marimo/app/(main)/guest-book/[userId]/_components/user-recommend.module.css"

import { Marimo, User } from "@prisma/client"

export const UserRecommend = () => {
  const route = useRouter()

  const {
    container,
    recommend__header,
    refresh__button,
    user__ul,
    user__button,
    user_marimo,
    user_name,
  } = styles

  const [recommendedUsers, setRecommendedUsers] = useState<
    (User & { marimos: Marimo[] })[]
  >([])
  const [allUsers, setAllUser] = useState<(User & { marimos: Marimo[] })[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getRecommendUser = async () => {
    const response = await fetch(`/api/guestbook/recommend`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`response = await fetch(/api/guestbook/recommend error`)
    }

    const data = await response.json()
    const newRecommendUsers = getRandomElements(
      data.recommendedUsers,
      5,
    ) as (User & { marimos: Marimo[] })[]

    setAllUser(data.recommendedUsers)
    setRecommendedUsers(newRecommendUsers)

    console.log(newRecommendUsers)

    setIsLoading(false)
  }

  const onRefreshHandler = (users: User[]): void => {
    setIsLoading(true)

    setTimeout(() => {
      const newRecommendUsers = getRandomElements(users, 5) as (User & {
        marimos: Marimo[]
      })[]
      setRecommendedUsers(newRecommendUsers)

      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    getRecommendUser()
  }, [])

  return (
    <div className={container}>
      <div className={recommend__header}>
        <p className="text-lg-b">📖 다른 방명록 놀러가기</p>
        <button
          className={refresh__button}
          onClick={(event) => {
            event.stopPropagation()

            onRefreshHandler(allUsers)
          }}
        >
          새로고침
        </button>
      </div>
      {isLoading && (
        <div>
          <p>로딩중 ...</p>
        </div>
      )}
      <ul className={user__ul}>
        {!isLoading &&
          recommendedUsers.map((user) => {
            const activeMarimo = user.marimos[0]

            if (!activeMarimo) return

            const name = user.email.split("@")[0]

            return (
              <button
                className={user__button}
                key={user.id}
                onClick={() => route.push(`/guest-book/${user.id}`)}
              >
                <div className={user_marimo}>
                  <Image
                    src={activeMarimo.src ?? "/images/marimo.svg"}
                    layout="fill"
                    objectFit="contain"
                    alt={`${user?.id}`}
                  />
                </div>
                <p className={user_name}>{name}님의 방명록</p>
              </button>
            )
          })}
      </ul>
    </div>
  )
}
