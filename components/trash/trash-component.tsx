"use client"
import Image from "next/image"

import { useEffect, useRef } from "react"

import { useInterval } from "@marimo/hooks/use-interval"

import { getTrashImage } from "@marimo/public/utils/level-image"

import styles from "@marimo/components/trash/trash.module.css"

import { useStore } from "@marimo/stores/use-store"
import { TrashToObjectUseCase } from "@marimo/application/usecases/object/trash-object-usecase"

export default function TrashComponent() {
  const { trashItem, trashImage } = styles

  const worker = useRef<Worker | null>(null)
  const idCounter = useRef(0)

  const { trashItems, addTrashItems } = useStore()

  useEffect(() => {
    worker.current = new Worker(
      new URL("/public/workers/trash-worker", import.meta.url),
      { type: "module" },
    )

    worker.current.onmessage = (
      event: MessageEvent<{
        points: Array<{ x: number; y: number; isInside: boolean }>
        piValue: number
      }>,
    ) => {
      // 각 포인트마다 쓰레기 아이템 생성
      const newTrashItems = event.data.points.map((point) => {
        const level = Math.floor(Math.random() * 3) // 0-2 사이의 레벨 생성
        return {
          // id: idCounter.current++,
          level,
          url: getTrashImage(level), // level에 따른 이미지 URL 추가
          rect: {
            x: point.x * 100, // 0-100% 위치값으로 변환
            y: point.y * 100,
          },
          type: "trash",
        }
      })

      addTrashItems(newTrashItems)

      const useCase = new TrashToObjectUseCase()
      const marimoId = 123 // 예제 마리모 ID

      const convertTrashToObject = async () => {
        await useCase.execute(trashItems, marimoId)
      }

      convertTrashToObject()
      console.log("trash", newTrashItems)
    }

    return () => {
      worker.current?.terminate()
    }
  }, [])

  useInterval(() => {
    if (worker.current) {
      worker.current.postMessage(1) // 한 번에 1개의 포인트 생성
    }
  }, 20000)

  return (
    <div>
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
