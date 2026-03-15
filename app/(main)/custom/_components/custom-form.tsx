"use client"

import { redirect } from "next/navigation"

import { RefObject, useRef, useState } from "react"

import ChangeColor from "@marimo/app/(main)/custom/_components/change-color"

import styles from "@marimo/app/(main)/custom/_components/custom-form.module.css"

import html2canvas from "html2canvas"
import { useStore } from "@marimo/stores/use-store"
import { Coupon, Marimo, MarimoImage } from "@prisma/client"

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
  const { user, setImages } = useStore()

  const angryRef = useRef<HTMLDivElement>(null)
  const leftTwerkRef = useRef<HTMLDivElement>(null)
  const rightTwerkRef = useRef<HTMLDivElement>(null)
  const deadRef = useRef<HTMLDivElement>(null)

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
    if (
      angryRef.current &&
      leftTwerkRef.current &&
      rightTwerkRef.current &&
      deadRef.current
    ) {
      const refArr = [
        { key: "angry", ref: angryRef },
        { key: "leftTwerk", ref: leftTwerkRef },
        { key: "rightTwerk", ref: rightTwerkRef },
        { key: "dead", ref: deadRef },
      ]

      const formData = new FormData()

      await Promise.all(
        refArr.map(
          async ({
            key,
            ref,
          }: {
            key: string
            ref: RefObject<HTMLDivElement | null>
          }) => {
            if (!ref || !ref.current) return

            const canvas = await html2canvas(ref.current, {
              backgroundColor: null,
            })

            const imgData = canvas.toDataURL("image/png")

            const fileName = `user${user?.id}${key}marimo${new Date().getTime()}.png`

            const byteString = atob(imgData.split(",")[1])
            const arrayBuffer = new ArrayBuffer(byteString.length)
            const uintArray = new Uint8Array(arrayBuffer)

            for (let i = 0; i < byteString.length; i++) {
              uintArray[i] = byteString.charCodeAt(i)
            }

            const blob = new Blob([uintArray], { type: "image/png" })

            formData.append(key, blob, fileName)
          },
        ),
      )

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

        return result
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const handleSubmit = async () => {
    if (!user || !user.id) return

    const src: Partial<MarimoImage> = await captureImage()

    if (!src) {
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
        marimo,
        marimoImages: src,
        coupon: coupon.coupons[0],
      }),
    })

    if (!response.ok)
      return alert("업데이트에 실패했습니다! 다시 시도해주세요!")

    const images = await response.json()

    const { angry, dead, leftTwerk, rightTwerk } = images

    setImages(angry, dead, leftTwerk, rightTwerk)

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
            angryRef={angryRef}
            leftTwerkRef={leftTwerkRef}
            rightTwerkRef={rightTwerkRef}
            deadRef={deadRef}
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
