"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense } from "react"

import styles from "@marimo/app/(main)/pay/toss/fail/page.module.css"

const FailPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    box_section,
    p_grid,
    typography__p,
    p_grid_col,
    text__left,
    text__right,
    button,
  } = styles

  return (
    <div id="info" className={box_section} style={{ width: "600px" }}>
      <Image
        width={100}
        height={100}
        src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
        alt="에러 이미지"
      />
      <h2>결제를 실패했어요</h2>

      <div
        className={`${p_grid} ${typography__p}`}
        style={{ marginTop: "50px" }}
      >
        <div className={`${p_grid_col} ${text__left}`}>
          <b>에러메시지</b>
        </div>
        <div className={`${p_grid_col} ${text__right}`} id="message">
          {searchParams.get("message")}
        </div>
      </div>
      <div
        className={`${p_grid} ${typography__p}`}
        style={{ marginTop: "10px" }}
      >
        <div className={`${p_grid_col} ${text__left}`}>
          <b>에러코드</b>
        </div>
        <div className={`${p_grid_col} ${text__right}`} id="code">
          {searchParams.get("code")}
        </div>
      </div>

      <button className={button} onClick={() => router.push("/")}>
        메인 페이지로 이동
      </button>
    </div>
  )
}

const SuspendedFailPage = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <FailPage />
  </Suspense>
)

export default SuspendedFailPage
