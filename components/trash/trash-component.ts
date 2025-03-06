"use client"
import { useEffect, useRef, useState } from "react"

import { useInterval } from "@marimo/hooks/use-interval"

import { getTrashImage } from "@marimo/public/utils/level-image"

import { HEADER_HEIGHT, TRASH_LIMIT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export default function TrashComponent() {
  const worker = useRef<Worker | null>(null)
  const idCounter = useRef(0)

  const { trashItems, addTrashItems } = useStore()
  const [isWorkerRunning, setIsWorkerRunning] = useState(true)

  useEffect(() => {
    const headerHeight = HEADER_HEIGHT
    if (!isWorkerRunning) return
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
      const newTrashItems: ITrashDto[] = event.data.points.map((point) => {
        const level = Math.floor(Math.random() * 3) // 0-2 사이의 레벨 생성
        return {
          id: idCounter.current++,
          level,
          url: getTrashImage(level),
          rect: {
            x: point.x * 100,
            y: point.y * 100 + (headerHeight / window.innerHeight) * 100,
          },
          type: "trash",
        }
      })
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
      worker.current?.terminate() // 데이터  누수 방지
      worker.current = null
    }
  }, [isWorkerRunning])

  useInterval(() => {
    if (!isWorkerRunning || !worker.current) return
    if (trashItems.length < TRASH_LIMIT) {
      worker.current?.postMessage(1)
    } else {
      worker.current?.terminate()
      worker.current = null
      setIsWorkerRunning(false)
    }
  }, 20000)
}
