import Image from "next/image"

import styles from "@marimo/app/(main)/guest-book/[userId]/_components/aside.module.css"

import { Marimo } from "@prisma/client"

interface AsideProps {
  owner: {
    name: string
    src: string
    description: string
  }

  ownerMarimo: Marimo
}

export const Aside = ({ owner, ownerMarimo }: AsideProps) => {
  const { aside__wrapper, contents__div, user_marimo, description } = styles

  return (
    <div className={aside__wrapper}>
      <div className={user_marimo}>
        <Image
          src={ownerMarimo?.src ?? "/images/marimo.svg"}
          layout="fill"
          objectFit="contain"
          alt={`${owner?.name}`}
        />
      </div>
      <div className={contents__div}>
        <div>
          <p>안녕하세요,</p>
          {owner.name}님의 방명록입니다.
        </div>
        <div className={description}>{owner.description}</div>
      </div>
    </div>
  )
}
