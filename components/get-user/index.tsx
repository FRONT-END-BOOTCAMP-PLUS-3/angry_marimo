"use client"

import { redirect } from "next/navigation"

import { useEffect } from "react"

import { useStore } from "@marimo/stores/use-store"

const url = process.env.NEXT_PUBLIC_URL

export const GetUser = () => {
  const { setUser, clearUser, setMarimo, resetImages } = useStore()

  const logoutHandler = async () => {
    await fetch("/api/logout", {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    })

    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`

    resetImages()

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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (marimoResponse.ok) {
        const result = await marimoResponse.json()
        const marimo = result.user
        setMarimo(marimo)
      }

      setUser(user)
    } catch (error) {
      console.error("get-user error --->", error)
    }
  }

  useEffect(() => {
    fetchedUser()
  }, [])

  return <></>
}
