"use client"

import { useState } from "react"

import ChangeColor from "@marimo/app/(main)/custom/_components/change-color"

import styles from "@marimo/app/(main)/custom/page.module.css"

interface CustomPageProps {
  initialName?: string
}

const CustomPage = ({ initialName = "marimo" }: CustomPageProps) => {
  const ticket = 0
  const currentColor = "#89A45F"

  const {
    container,
    title_container,
    custom_wrapper,
    custom_container,
    name_input,
    summit_button,
    button_wrapper,
    a,
    p,
  } = styles

  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(currentColor)

  return (
    <div className={container}>
      <div className={title_container}>
        <h3 className="text-3xl">마리모 꾸미기 (마-꾸)</h3>
        <p>보유 꾸미기 티켓 : {ticket}</p>
        <p>티켓 하나를 소모해서 마리모를 커스텀 합니다.</p>
      </div>
      <div className={custom_wrapper}>
        <div className={custom_container}>
          <label htmlFor="name" className="text-xl">
            마리모 이름
          </label>
          <input
            value={name}
            className={`${name_input} text-lg`}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className={custom_container}>
          <p className="text-xl">마리모 색상</p>
          <ChangeColor color={color} setColor={setColor} />
        </div>
      </div>

      <div className={button_wrapper}>
        <button disabled={ticket < 1} className={summit_button}>
          커스텀 확정하기
        </button>
        {ticket < 1 && (
          <p className={p}>
            티켓 개수가 부족해요! 티켓 얻으러 가기 👉
            <a href="/pay" className={a}>
              Get a ticket
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

export default CustomPage
