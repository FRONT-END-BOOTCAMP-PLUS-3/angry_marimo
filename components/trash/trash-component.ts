"use client"
import { useEffect, useRef } from "react"

import { useInterval } from "@marimo/hooks/use-interval"

import { getTrashImage } from "@marimo/public/utils/level-image"

import { useStore } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export default function TrashComponent() {
  const worker = useRef<Worker | null>(null)
  const idCounter = useRef(0)

  const { addTrashItems } = useStore()

  useEffect(() => {
    const headerHeight = 100 // 임의값 수정
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
      const newTrashItems: ITrashDto[] = event.data.points.map((point) => {
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
      const marimoId = 12 // 임의 마리모 ID

      try {
        const response = await fetch(`/api/objects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marimoId: marimoId,
            trashData: newTrashItems,
          }),
        })
        if (!response.ok) {
          throw new Error(`마리모 아이디 보내는데 에러입니다다: ${marimoId}`)
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
    worker.current?.postMessage(1)
  }, 20000)
}
