import { Header } from "@marimo/components/header"
import { GetUser } from "@marimo/components/get-user"
import FeedbackButton from "@marimo/components/feedback-btn/feedback-btn"

import "@marimo/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <GetUser />
      <Header />
      <main>{children}</main>
      <FeedbackButton />
    </>
  )
}
