"use client"
import dynamic from "next/dynamic"

import { useInterval } from "@marimo/hooks/use-interval"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { TRASH_LIMIT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { idCounter } = useStore()
  const {
    worker,
    isWorkerRunning,
    workerLoading,
    setIsWorkerRunning,
    terminateWorker,
  } = useWorker()
  useWindowEvents(worker)

  useInterval(() => {
    if (!isWorkerRunning) return
    if (!worker.current) return
    if (!idCounter) return

    const trashItemId = idCounter
    workerLoading()
    if (trashItemId !== 0 && trashItemId < TRASH_LIMIT) {
      worker.current.postMessage(1)
    } else {
      terminateWorker()
      setIsWorkerRunning(false)
    }
  }, 20000)

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
