"use client"

import { redirect } from "next/navigation"

import { useEffect } from "react"

import { useStore } from "@marimo/stores/use-store"

const url = process.env.NEXT_PUBLIC_URL

export const GetUser = () => {
  const { setUser, clearUser } = useStore()

  const logoutHandler = async () => {
    await fetch("/api/logout", {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    })

    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`

    redirect("/login")
  }

  const fetchedUser = async () => {
    const response = await fetch(`${url}/api/user`, {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.status !== 200) {
      clearUser()
      logoutHandler()
      redirect("/login")
    }

    const { user } = await response.json()

    if (!user || !user.id) {
      logoutHandler()
      redirect("/login")
    }

    setUser(user)
  }

  useEffect(() => {
    fetchedUser()
  }, [])

  return <></>
}
