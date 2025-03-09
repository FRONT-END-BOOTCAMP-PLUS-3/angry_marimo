"use client"
import dynamic from "next/dynamic"

import { useInterval } from "@marimo/hooks/use-interval"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { TRASH_LIMIT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { trashItems } = useStore()
  const { worker, isWorkerRunning, setIsWorkerRunning } = useWorker()
  // window event 감지하는 함수 utils
  useWindowEvents(worker)

  useInterval(() => {
    if (!isWorkerRunning) return
    if (!worker.current) return
    if (!trashItems) return

    const trashItemId = trashItems.id

    console.log("✅ useInterval 요청보내기", trashItemId)
    if (trashItemId !== 0 && trashItemId < TRASH_LIMIT) {
      worker.current.postMessage(1)
    } else {
      worker.current.terminate()
      worker.current = null
      setIsWorkerRunning(false)
    }
  }, 2000)

  return <></>
}

const DynamicTrashComponent = dynamic(
  () => Promise.resolve(useObjectComponent),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
)

export default DynamicTrashComponent
