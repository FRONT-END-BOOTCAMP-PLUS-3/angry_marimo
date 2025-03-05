"use client"

import { Dispatch, SetStateAction, useRef } from "react"

import styles from "@marimo/app/(main)/custom/_components/change-color.module.css"

import html2canvas from "html2canvas"
import { HexColorPicker } from "react-colorful"
import { useStore } from "@marimo/stores/use-store"
import Marimo from "@marimo/public/images/custom-marimo.svg"

interface CreateMarimoProps {
  color: string
  setColor: Dispatch<SetStateAction<string>>
}

const ChangeColor = ({ color, setColor }: CreateMarimoProps) => {
  const { user } = useStore()

  const width = 200
  const height = 200

  const { wrapper } = styles
  const captureRef = useRef<HTMLDivElement>(null)

  const captureImage = async () => {
    if (!user || !user.id) return

    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
      })

      const imgData = canvas.toDataURL("image/png")
      console.log("imgData", imgData)

      const fileName = `${user.id}-marimo-${new Date().getTime()}.png`

      const byteString = atob(imgData.split(",")[1])
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uintArray = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([uintArray], { type: "image/png" })
      const formData = new FormData()
      formData.append("image", blob, fileName)

      // 서버로 이미지 전송
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const result = await response.json()
        console.log("Image uploaded successfully", result)
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

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
