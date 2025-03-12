"use client"

import { redirect } from "next/navigation"

import { useEffect } from "react"

import { useStore } from "@marimo/stores/use-store"

const url = process.env.NEXT_PUBLIC_URL

export const GetUser = () => {
  const { setUser, clearUser, setMarimo } = useStore()

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
    try {
      const userResponse = await fetch(`${url}/api/user`, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
      })

      if (!userResponse.ok) {
        clearUser()
        logoutHandler()
        redirect("/login")
      }

      const { user } = await userResponse.json()

      if (!user || !user.id) {
        logoutHandler()
        redirect("/login")
      }

      const marimoResponse = await fetch(`${url}/api/marimo/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }).then((res) => res.json())

      const marimo = marimoResponse.user

      setUser(user)
      if (marimo) setMarimo(marimo)
    } catch (error) {
      console.error("get-user error --->", error)
    }
  }

  useEffect(() => {
    fetchedUser()
  }, [])

  return <></>
}
