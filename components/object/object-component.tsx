"use client"
import dynamic from "next/dynamic"

import { useEffect } from "react"

import { Loading } from "@marimo/components/loading"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { marimo, isMarimoLoading } = useStore()
  const { worker, isWorkerRunning, workerLoading, terminateWorker } =
    useWorker()

  useWindowEvents(worker)

  useEffect(() => {
    if(!isMarimoLoading) return
    if (!window || !isWorkerRunning || !worker.current || !marimo) return

    const windowHeight = window.innerHeight || 1
    worker.current.postMessage({
      windowHeight,
    })
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
