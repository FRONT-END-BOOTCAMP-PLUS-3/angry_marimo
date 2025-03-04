"use client"
import Image from "next/image"

import { useEffect, useRef } from "react"

import { useInterval } from "@marimo/hooks/use-interval"

import { getTrashImage } from "@marimo/public/utils/level-image"

import styles from "@marimo/components/trash/trash.module.css"

import { useStore } from "@marimo/stores/use-store"

export default function TrashComponent() {
  const { trashItem, trashImage } = styles

  const worker = useRef<Worker | null>(null)
  const idCounter = useRef(0)

  const { trashItems, addTrashItems } = useStore()

  useEffect(() => {
    const headerHeight = 200 // 임의값 수정
    worker.current = new Worker(
      new URL("/public/workers/trash-worker", import.meta.url),
      { type: "module" },
    )

    worker.current.onmessage = async (
      event: MessageEvent<{
        points: Array<{ x: number; y: number; isInside: boolean }>
        piValue: number
      }>,
    ) => {
      // 각 포인트마다 쓰레기 아이템 생성
      const newTrashItems = event.data.points.map((point) => {
        const level = Math.floor(Math.random() * 3) // 0-2 사이의 레벨 생성
        return {
          id: idCounter.current++,
          level,
          url: getTrashImage(level), // level에 따른 이미지 URL 추가
          rect: {
            x: point.x * 100, // 0-100% 위치값으로 변환
            y: point.y * 100 + (headerHeight / window.innerHeight) * 200,
          },
          type: "trash",
        }
      })
      // client zustand 에 값 저장해줌
      addTrashItems(newTrashItems)
      console.log("trashItem!!!!!", newTrashItems)
      // 잘담김
      const marimoId = 123 // 예제 마리모 ID
      console.log("marimoID!!!!", marimoId)

      try {
        const response = await fetch(`/api/objects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marimoId: marimoId,
            trashData: trashItems,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to send data for marimoId: ${marimoId}`)
        }
        console.log("📤 모든 객체 API 전송 완료")
      } catch (error) {
        console.error("❌ 변환 중 오류 발생:", error)
      }
    }

    return () => {
      worker.current?.terminate()
    }
  }, [])

  useInterval(() => {
    worker.current?.postMessage(1) // 한 번에 1개의 포인트 생성
  }, 20000)

  return (
    <div>
      {/* 컴포넌트 싹 날리고 css 날리고 tsx -> ts 로 변경해서 올리기 */}
      <h2>쓰레기 컴포넌트 생성기</h2>
      <div>
        {trashItems.map((item) => (
          <div
            id="trash_item"
            key={item.id}
            className={trashItem}
            style={{
              left: `${item.rect.x}%`,
              top: `${item.rect.y}%`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Image
              src={getTrashImage(item.level)}
              alt={`Trash Level ${item.level}`}
              className={trashImage}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
