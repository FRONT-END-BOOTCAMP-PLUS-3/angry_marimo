"use client"

import Image from "next/image"
import { redirect } from "next/navigation"

import styles from "@marimo/app/not-found.module.css"

import type { NextPage } from "next"

const NotFound: NextPage = () => {
  const { container } = styles

  return (
    <div className={container}>
      <h1 className="text-3xl">404 - 페이지를 찾을 수 없습니다</h1>
      <div>
        <Image src={"/images/dead-marimo.svg"} alt="not-found" fill />
      </div>
      <p>주소를 확인하고 다시 시도해 주세요.</p>
      <button onClick={() => redirect("/")}>메인 페이지로 돌아가기</button>
    </div>
  )
}

export default NotFound
