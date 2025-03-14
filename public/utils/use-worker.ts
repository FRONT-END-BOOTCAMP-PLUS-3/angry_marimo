"use client"
import { useEffect, useRef, useState } from "react"

import { useStore } from "@marimo/stores/use-store"

export const useWorker = () => {
  const worker = useRef<Worker>(null)
  const { trashItems, addTrashItems, marimo } = useStore()
  const [isWorkerRunning, setIsWorkerRunning] = useState(true)

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

    worker.current = new Worker(
      new URL("/public/workers/object-worker", import.meta.url),
      { type: "module" },
    )

    worker.current.onmessage = async (event) => {
      const { data: objectItem } = event
      if ((trashItems?.length || 0) < 30) addTrashItems(objectItem)
    }

    worker.current.onerror = (error) => {
      console.error("❌ Worker 오류 발생:", error)
    }
  }

  const terminateWorker = () => {
    if (worker.current) {
      worker.current.terminate()
      worker.current = null
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
