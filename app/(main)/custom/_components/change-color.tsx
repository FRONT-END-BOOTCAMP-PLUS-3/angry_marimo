"use client"

import { Dispatch, SetStateAction, useRef } from "react"

import styles from "@marimo/app/(main)/custom/_components/change-color.module.css"

import html2canvas from "html2canvas"
import { HexColorPicker } from "react-colorful"
import Marimo from "@marimo/public/images/custom-marimo.svg"

interface CreateMarimoProps {
  color: string
  setColor: Dispatch<SetStateAction<string>>
}

const ChangeColor = ({ color, setColor }: CreateMarimoProps) => {
  const width = 200
  const height = 200

  const { wrapper } = styles
  const captureRef = useRef<HTMLDivElement>(null)

  // const captureImage = async () => {
  //   console.log("click =====")
  //   console.log("captureRef.current", captureRef.current)
  //   if (captureRef.current) {
  //     const canvas = await html2canvas(captureRef.current, {
  //       backgroundColor: null, // 투명 배경 유지
  //     })
  //     console.log("canvas", canvas)
  //     const imgData = canvas.toDataURL("image/png")
  //     console.log("imgData", imgData)

  //     // 이미지 다운로드 예제
  //     const link = document.createElement("a")
  //     console.log("link", link)
  //     link.href = imgData
  //     link.download = "marimo.png"
  //     link.click()
  //   }
  // }

  return (
    <div className={wrapper}>
      <div
        ref={captureRef}
        style={{
          width,
          height,
        }}
      >
        <Marimo width={width} height={height} color={color} />
      </div>
      <HexColorPicker color={color} onChange={setColor} />
    </div>
  )
}

export default ChangeColor
