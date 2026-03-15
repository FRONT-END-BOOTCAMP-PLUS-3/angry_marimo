"use client"

import Link from "next/link"
import Image from "next/image"

import styles from "@marimo/components/header/horizontal-logo.module.css"

import { useStore } from "@marimo/stores/use-store"

export const HorizontalLogo = () => {
  const { marimo } = useStore()
  const { wrapper, img_div, title } = styles

  return (
    <Link className={wrapper} href={"/"}>
      <div className={img_div}>
        <Image
          id="logo"
          src={marimo?.src ?? "./images/marimo.svg"}
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
