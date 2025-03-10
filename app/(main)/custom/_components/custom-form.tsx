"use client"

import { redirect } from "next/navigation"

import { useRef, useState } from "react"

import ChangeColor from "@marimo/app/(main)/custom/_components/change-color"

import styles from "@marimo/app/(main)/custom/_components/custom-form.module.css"

import html2canvas from "html2canvas"
import { Coupon, Marimo } from "@prisma/client"
import { useStore } from "@marimo/stores/use-store"

interface CustomFormProps {
  marimo: Marimo
  coupon: {
    count: number
    coupons: Coupon[]
  }
  initialName: string
  initialColor: string
}

const CustomForm = ({
  marimo,
  coupon,
  initialName,
  initialColor,
}: CustomFormProps) => {
  const { user } = useStore()

  const captureRef = useRef<HTMLDivElement>(null)

  const {
    title_container,
    custom_wrapper,
    custom_container,
    name_input,
    summit_button,
    button_wrapper,
    custom_title,
    a,
    p,
  } = styles

  const [name, setName] = useState<string>(initialName)
  const [color, setColor] = useState<string>(initialColor)

  const captureImage = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
      })

      const imgData = canvas.toDataURL("image/png")

      const fileName = `user${user?.id}marimo${new Date().getTime()}.png`

      const byteString = atob(imgData.split(",")[1])
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uintArray = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([uintArray], { type: "image/png" })
      const formData = new FormData()
      formData.append("image", blob, fileName)

      try {
        const response = await fetch("/api/custom", {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const result = await response.json()

        return result.src
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const handleSubmit = async () => {
    if (!user || !user.id) return

    const src: string = await captureImage()

    console.log(src)

    if (!src || typeof src !== "string") {
      alert("마리모 저장에 실패했습니다, 다시 시도해주세요!")
      return
    }

    const response = await fetch("/api/custom", {
      method: "PUT",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        marimo: {
          ...marimo,
          src,
          name,
          color,
        },
        coupon: coupon.coupons[0],
      }),
    })

    if (!response.ok)
      return alert("업데이트에 실패했습니다! 다시 시도해주세요!")

    redirect("/")
  }

  return (
    <>
      <div className={title_container}>
        <h3 className="text-3xl">마리모 꾸미기 (마-꾸)</h3>
        <p>보유 꾸미기 티켓 : {coupon.count}</p>
        <p>티켓 하나를 소모해서 마리모를 커스텀 합니다.</p>
      </div>
      <div className={custom_wrapper}>
        <div className={custom_container}>
          <div className={custom_title}>
            <label htmlFor="name" className="text-xl">
              마리모 이름
            </label>
            <button onClick={() => setName(initialName)}>되돌리기</button>
          </div>
          <input
            id="name"
            type="text"
            value={name}
            className={`${name_input} text-lg`}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className={custom_container}>
          <div className={custom_title}>
            <p className="text-xl">마리모 색상</p>
            <button onClick={() => setColor(initialColor)}>되돌리기</button>
          </div>
          <ChangeColor
            captureRef={captureRef}
            name={name}
            color={color}
            setColor={setColor}
          />
        </div>
      </div>

      <div className={button_wrapper}>
        <button
          disabled={coupon.count < 1}
          className={summit_button}
          onClick={handleSubmit}
        >
          커스텀 확정하기
        </button>
        {coupon.count < 1 && (
          <p className={p}>
            티켓 개수가 부족해요! 티켓 얻으러 가기 👉
            <a href="/pay" className={a}>
              Get a coupon
            </a>
          </p>
        )}
      </div>
    </>
  )
}

export default CustomForm
