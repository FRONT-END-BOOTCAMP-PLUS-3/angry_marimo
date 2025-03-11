"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { useState, useRef, useEffect } from "react"

import { formatRelativeTime } from "@marimo/utils/format-relative-time"

import styles from "@marimo/app/(main)/guest-book/[userId]/_components/post-card.module.css"

interface PostCardProps {
  user: {
    id: number
    email: string
    src?: string
  }
  post: {
    id: number
    content: string
    createdAt?: string
  }
}

export const PostCard = ({ user, post }: PostCardProps) => {
  const route = useRouter()
  const contentRef = useRef<HTMLDivElement>(null) // 콘텐츠 높이 측정용 Ref

  const {
    post_card__wrapper,
    post_card__header,
    user_info__wrapper,
    user_image__div,
    post_content,
    post_content__line_height,
    post_content_more__button,
  } = styles

  const [isOpenContent, setIsOpenContent] = useState<boolean>(false)
  const [isTruncated, setIsTruncated] = useState<boolean>(false)

  const name = user.email.split("@")[0]
  const date = formatRelativeTime(post.createdAt ?? new Date().toISOString())

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight,
      )
      const maxHeight = lineHeight * 3 // 3줄 높이 계산
      setIsTruncated(contentRef.current.scrollHeight > maxHeight) // 실제 높이 비교
    }
  }, [post.content])

  return (
    <div className={post_card__wrapper}>
      <div className={post_card__header}>
        <button
          className={user_info__wrapper}
          onClick={() => route.push(`/guest-book/${user.id}`)}
        >
          <div className={user_image__div}>
            <Image
              src={user.src ?? "/images/marimo.svg"}
              layout="fill"
              objectFit="cover"
              alt={`${post.id}`}
            />
          </div>
          <div className="text-lg-b">{name}</div>
        </button>
        <div className="text-xs">{date}</div>
      </div>
      <div>
        <div
          ref={contentRef} // 높이 측정용 Ref
          className={`${!isOpenContent && post_content} ${post_content__line_height}`}
          style={{ WebkitLineClamp: isOpenContent ? "unset" : 3 }} // 더보기 클릭 시 전체 표시
        >
          {post.content}
        </div>
        {isTruncated && ( // 3줄 이상일 때만 표시
          <button
            onClick={() => setIsOpenContent((prev) => !prev)}
            className={post_content_more__button}
          >
            <p className="text-sm">{isOpenContent ? "닫기" : "더보기"}</p>
          </button>
        )}
      </div>
    </div>
  )
}
