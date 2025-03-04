import type { Metadata } from "next"

import "@marimo/app/globals.css"

export const metadata: Metadata = {
  title: "Angry Marimo",
  description: `Angry Marimo: 디지털 외로움 해결 프로젝트
  픽셀마리모는 웹을 통해 언제 어디서나 키울 수 있는 디지털 반려 존재입니다. 유저는 마리모를 돌보면서 정서적 교감을 형성할 수 있습니다.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
