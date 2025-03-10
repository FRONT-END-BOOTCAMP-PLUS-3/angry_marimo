"use client"
import { useEffect, useRef, useState } from "react"

import { getTrashImage } from "@marimo/public/utils/level-image"

import { HEADER_HEIGHT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export const useWorker = () => {
  const worker = useRef<Worker>(null) // 워커 초기 상태를 null로 설정
  const { addTrashItems, marimo } = useStore()
  const [isWorkerRunning, setIsWorkerRunning] = useState(true)
  const headerHeight = HEADER_HEIGHT

  useEffect(() => {
    if (!isWorkerRunning) return
    initializeWorker()
    return () => {
      terminateWorker()
    }
  }, [isWorkerRunning])

  const initializeWorker = () => {
    if (!isWorkerRunning) {
      return
    } else if (worker.current) {
      console.log("✅ Worker 이미 초기화됨")
      return
    }
    workerLoading()
  }

  const workerLoading = () => {
    if (typeof window === "undefined" || !window.Worker) {
      console.error("❌ Web Workers를 지원하지 않는 환경입니다.")
      return
    }

    try {
      worker.current = new Worker(
        new URL("/public/workers/object-worker", import.meta.url),
        { type: "module" },
      )
      worker.current.postMessage(1)
      worker.current.onmessage = async (event) => {
        const points = event.data.points
        if (!points || points.length === 0) {
          console.log("⚠️ No points data received.")
          return
        }
        const point = points[0]
        const level = Math.floor(Math.random() * 3) + 1
        const newTrashItem: Omit<ITrashDto, "id"> = {
          level,
          url: getTrashImage(level),
          rect: {
            x: point.x * 100,
            y: point.y * 100 + (headerHeight / window.innerHeight) * 100,
          },
          isActive: true,
          type: "trash",
        }

        await sendTrashData(newTrashItem)
      }

      worker.current.onerror = (error) => {
        console.error("❌ Worker 오류 발생:", error)
      }
    } catch (error) {
      console.error("❌ Worker 생성 오류:", error)
    }
  }

  const terminateWorker = () => {
    if (worker.current) {
      worker.current.terminate()
      worker.current = null
    }
  }

  const sendTrashData = async (trashData: Omit<ITrashDto, "id">) => {
    if (!marimo || !marimo.id) return

    try {
      const response = await fetch(`/api/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marimoId: marimo.id,
          trashData,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`🚨 API 요청 실패: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      addTrashItems(data.objectItem)
    } catch (error) {
      console.error("❌ API 전송 중 오류 발생:", error)
    }
  }

  return {
    worker,
    isWorkerRunning,
    workerLoading,
    setIsWorkerRunning,
    initializeWorker,
    terminateWorker,
  }
}
