"use client"

import { Dispatch, RefObject, SetStateAction } from "react"

import styles from "@marimo/app/(main)/custom/_components/change-color.module.css"

import { HexColorPicker } from "react-colorful"
import Marimo from "@marimo/public/images/custom-marimo.svg"
import Dead from "@marimo/public/images/custom-dead-marimo.svg"
import LeftTwerk from "@marimo/public/images/custom-left-twerking-marimo.svg"
import RightTwerk from "@marimo/public/images/custom-right-twerking-marimo.svg"

interface CreateMarimoProps {
  angryRef: RefObject<HTMLDivElement | null>
  leftTwerkRef: RefObject<HTMLDivElement | null>
  rightTwerkRef: RefObject<HTMLDivElement | null>
  deadRef: RefObject<HTMLDivElement | null>
  name: string
  color: string
  setColor: Dispatch<SetStateAction<string>>
}

const ChangeColor = ({
  angryRef,
  leftTwerkRef,
  rightTwerkRef,
  deadRef,
  name,
  color,
  setColor,
}: CreateMarimoProps) => {
  const width = 240
  const height = 200

  const { wrapper, marimo_name, marimo_images } = styles

  return (
    <div className={wrapper}>
      <div ref={angryRef}>
        <p className={marimo_name}>{name}</p>
        <Marimo width={width} height={height} color={color} />
      </div>
      <HexColorPicker color={color} onChange={setColor} />

      <div className={marimo_images}>
        <div ref={leftTwerkRef}>
          <p className={marimo_name}>{name}</p>
          <LeftTwerk width={width} height={height} color={color} />
        </div>
        <div ref={rightTwerkRef}>
          <p className={marimo_name}>{name}</p>
          <RightTwerk width={width} height={height} color={color} />
        </div>
        <div ref={deadRef}>
          <p className={marimo_name}>{name}</p>
          <Dead width={width} height={height} color={color} />
        </div>
      </div>
    </div>
  )
}

export default ChangeColor
