"use client"

import Link from "next/link"
import Image from "next/image"

import styles from "@marimo/components/header/horizontal-logo.module.css"

export const HorizontalLogo = () => {
  const { wrapper, img_div, title } = styles
  return (
    <Link className={wrapper} href={"/"}>
      {/* FIXME : 이미지 변경해야 합니다. */}
      <div className={img_div}>
        <Image
          id="logo"
          src="./marimo/secondary_marimo.svg"
          fill
          alt="marimo"
        />
      </div>
      <p id="title" className={title}>
        Angry Marimo
      </p>
    </Link>
  )
}
