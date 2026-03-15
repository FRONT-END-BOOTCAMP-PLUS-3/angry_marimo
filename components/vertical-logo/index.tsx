import Link from "next/link"
import Image from "next/image"

import styles from "@marimo/components/vertical-logo/index.module.css"

export const VerticalLogo = () => {
  const url = process.env.NEXT_URL

  const { wrapper, title__div, title, image__div } = styles

  return (
    <div className={wrapper}>
      <Link href={`${url}/`}>
        <div className={title__div}>
          <p id="title" className={title}>
            Angry Marimo
          </p>
        </div>
        <div className={image__div}>
          <Image id="logo" src="./images/marimo.svg" fill alt="marimo" />
        </div>
      </Link>
    </div>
  )
}
