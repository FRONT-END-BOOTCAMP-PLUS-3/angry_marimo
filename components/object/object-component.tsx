"use client"
import dynamic from "next/dynamic"

import { useInterval } from "@marimo/hooks/use-interval"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { TRASH_LIMIT } from "@marimo/constants/trash-header"

export const useObjectComponent = () => {
  const { worker, isWorkerRunning, setIsWorkerRunning, trashItems } =
    useWorker()
  useWindowEvents(worker)

  useInterval(() => {
    if (!isWorkerRunning) return
    if (!worker.current) return

    if (trashItems.length < TRASH_LIMIT) {
      worker.current.postMessage(1)
    } else {
      worker.current.terminate()
      worker.current = null
      setIsWorkerRunning(false)
    }
  }, 20000)

  return <></>
}

const DynamicTrashComponent = dynamic(
  () => Promise.resolve(useObjectComponent),
  {
    ssr: false,
  },
)

export default DynamicTrashComponent
