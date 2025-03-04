"use client"

import { useRouter } from "next/navigation"

import { useEffect } from "react"

import { useStore } from "@marimo/stores/use-store"

export default function TossLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const route = useRouter()

  const { user } = useStore()

  useEffect(() => {
    if (!user || !user.id) route.push("/login")
  }, [user])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
