"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { generateJWT } from "@marimo/utils/jwt"

export const userLogin = async (formData: FormData) => {
  const url = process.env.NEXT_PUBLIC_URL ?? ""

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return
  }

  const data = await fetch(`${url}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!data.ok) {
    return redirect(`/login?status=${data.status}`)
  }

  const user = await data.json()

  const cookieStore = await cookies()
  const token = generateJWT(user.id, user.email)

  cookieStore.set("token", token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  redirect("/")
}
