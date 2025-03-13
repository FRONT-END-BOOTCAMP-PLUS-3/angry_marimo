"use client"
import dynamic from "next/dynamic"

import { useEffect } from "react"

import { Loading } from "@marimo/components/loading"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { marimo, isMarimoLoading, trashItems } = useStore()
  const { worker, isWorkerRunning, workerLoading, terminateWorker } =
    useWorker()

  useWindowEvents(worker)

  useEffect(() => {
    if (!isMarimoLoading) return
    if (!window || !isWorkerRunning || !worker.current || !marimo) return

    const windowHeight = window.innerHeight || 1

    const second = trashItems.length < 15 ? 77000 : 144000

    worker.current.postMessage({
      message: "start",
      windowHeight,
      second,
    })

    return () => {
      if (worker.current) {
        worker.current.postMessage({
          message: "stop",
          windowHeight,
          second,
        })
      }
    }
  }, [isMarimoLoading])

  useEffect(() => {
    workerLoading()

    return () => {
      terminateWorker()
    }
  }, [])

  return <></>
}

const DynamicTrashComponent = dynamic(
  () => Promise.resolve(useObjectComponent),
  {
    loading: () => <Loading />,
    ssr: false,
  },
)

export default DynamicTrashComponent
