"use client"

import { useRouter } from "next/navigation"

import { useState, useRef, useEffect, MouseEventHandler } from "react"

import styles from "@marimo/components/header/dropdown.module.css"

import { useStore } from "@marimo/stores/use-store"

export const Dropdown = () => {
  const route = useRouter()

  const { user } = useStore()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { dropdown, hr, button } = styles

  const logoutHandler: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()

    // 서버에 로그아웃 요청
    await fetch("/api/logout", {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    })

    // 클라이언트 쿠키 삭제
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`

    setIsOpen(false)

    route.push("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef}>
      <button className={button} onClick={() => setIsOpen((prev) => !prev)}>
        {user ? user?.name : "unknown"} 님
      </button>
      {isOpen && (
        <div className={dropdown}>
          <button className={button}>새 마리모 만들기</button>
          <hr className={hr} />
          <button
            className={button}
            onClick={(event) => {
              event.stopPropagation()

              setIsOpen(false)
              route.push("/pay")
            }}
          >
            마리모팀 후원하기
          </button>
          <hr className={hr} />
          <button className={button} onClick={logoutHandler}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
