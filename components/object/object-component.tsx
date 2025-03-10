"use client"
import dynamic from "next/dynamic"

import { useInterval } from "@marimo/hooks/use-interval"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { TRASH_LIMIT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { idCounter } = useStore()
  console.log("✅ trashItems 확인용", idCounter)
  const { worker, isWorkerRunning, workerLoading, setIsWorkerRunning, terminateWorker } =
    useWorker()
  console.log("✅ useWorker 확인용", isWorkerRunning)
  useWindowEvents(worker)
  console.log("✅ useWindowEvents 확인용", worker)

  useInterval(() => {
    if (!isWorkerRunning) return
    if (!worker.current) return
    if (!idCounter) return
    
    const trashItemId = idCounter
    workerLoading();
    console.log("✅ useInterval 요청보내기", trashItemId)
    if (trashItemId !== 0 && trashItemId < TRASH_LIMIT) {
      console.log("✅ useInterval 접근하는지 확인", isWorkerRunning)
      worker.current.postMessage(1)
    } else {
      terminateWorker()
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
