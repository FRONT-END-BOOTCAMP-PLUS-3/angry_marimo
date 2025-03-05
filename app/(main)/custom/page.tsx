import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import CustomForm from "@marimo/app/(main)/custom/_components/custom-form"

import styles from "@marimo/app/(main)/custom/page.module.css"

const CustomPage = async () => {
  const url = process.env.NEXT_URL

  const { container } = styles

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const response = await fetch(`${url}/api/custom`, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: { Cookie: `token=${token}` },
  })

  if (!response.ok) redirect("/login")

  const result = await response.json()

  return (
    <div className={container}>
      <CustomForm
        marimoId={result.marimo.id}
        ticket={result.count}
        initialName={result.marimo.name}
        initialColor={result.marimo.color}
      />
    </div>
  )
}

export default CustomPage
