"use client"

import { Dispatch, RefObject, SetStateAction } from "react"

import styles from "@marimo/app/(main)/custom/_components/change-color.module.css"

import { HexColorPicker } from "react-colorful"
import Marimo from "@marimo/public/images/custom-marimo.svg"

interface CreateMarimoProps {
  captureRef: RefObject<HTMLDivElement | null>
  name: string
  color: string
  setColor: Dispatch<SetStateAction<string>>
}

const ChangeColor = ({
  captureRef,
  name,
  color,
  setColor,
}: CreateMarimoProps) => {
  const width = 240
  const height = 200

  const { wrapper, marimo_name } = styles

  return (
    <div className={wrapper}>
      <div ref={captureRef}>
        <p className={marimo_name}>{name}</p>
        <Marimo width={width} height={height} color={color} />
      </div>
      <HexColorPicker color={color} onChange={setColor} />
    </div>
  )
}

export default ChangeColor
