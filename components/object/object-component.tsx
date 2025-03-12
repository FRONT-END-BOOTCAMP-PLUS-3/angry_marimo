"use client"
import dynamic from "next/dynamic"

import { useInterval } from "@marimo/hooks/use-interval"

import { useWorker } from "@marimo/public/utils/use-worker"
import { useWindowEvents } from "@marimo/public/utils/use-window-event"

import { TRASH_LIMIT } from "@marimo/constants/trash-header"

import { useStore } from "@marimo/stores/use-store"

export const useObjectComponent = () => {
  const { trashItems } = useStore()
  const {
    worker,
    isWorkerRunning,
    workerLoading,
    setIsWorkerRunning,
    terminateWorker,
  } = useWorker()

  useWindowEvents(worker)

  // GET 요청 함수
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!marimo) {
  //       console.log("⚠️ [경고] marimo가 존재하지 않음! API 요청 취소");
  //       return;
  //     }
  //     try {
    
  //       const response = await fetch(`/api/objects?marimoId=${marimo.id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
    
  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         throw new Error(`🚨 API 요청 실패: ${response.status} - ${errorText}`);
  //       }
  //       const data = await response.json();
  //       setTrashItems(data.activeObject);

  //     } catch (error) {
  //       console.error("❌ [API 요청 중 오류 발생]:", error);
  //     }
  //     console.log("[최종 확인용 trashItem]", trashItems)
  //   };
    
  //   fetchData();
  // }, [marimo])


  useInterval(() => {
    if (!isWorkerRunning) return
    if (!worker.current) return
    if (!trashItems) return

    workerLoading()

    const itemCount = trashItems.length

    if (itemCount < TRASH_LIMIT) {
      worker.current.postMessage(1)
    } else if (itemCount > TRASH_LIMIT) {
      terminateWorker()
      setIsWorkerRunning(false)
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
