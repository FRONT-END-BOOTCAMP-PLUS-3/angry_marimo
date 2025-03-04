"use client"

import Link from "next/link"
import Image from "next/image"

import styles from "@marimo/components/header/horizontal-logo.module.css"

export const HorizontalLogo = () => {
  const { wrapper, img_div, title } = styles
  return (
    <Link className={wrapper} href={"/"}>
      <div className={img_div}>
        <Image id="logo" src="./images/marimo.svg" fill alt="marimo" />
      </div>
      <p id="title" className={title}>
        Angry Marimo
      </p>
    </Link>
  )
}
