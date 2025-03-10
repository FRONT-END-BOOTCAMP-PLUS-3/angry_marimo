"use client"
import { useEffect, useRef, useState } from "react";
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto";
import { HEADER_HEIGHT } from "@marimo/constants/trash-header";
import { useStore } from "@marimo/stores/use-store";
import { getTrashImage } from "./level-image";

export const useWorker = () => {
  const worker = useRef<Worker>(null) // 워커 초기 상태를 null로 설정
  const idCounter = useRef(0)
  const { addTrashItems } = useStore()
  const [isWorkerRunning, setIsWorkerRunning] = useState(true)
  const headerHeight = HEADER_HEIGHT

  useEffect(() => {
    if (!isWorkerRunning) return
    console.log("🔄 useEffect 실행: 워커 상태 확인 초기화 이루어짐")
    initializeWorker()
    return () => {
      terminateWorker()
    }
  }, [isWorkerRunning])

  const initializeWorker = () => {
    if (!isWorkerRunning) {
      console.log("⚠️ Worker가 실행 중이 아님. 초기화 중지")
      return
    } else if (worker.current) {
      console.log("✅ Worker 이미 초기화됨")
      return
    }
    console.log("🔄 Worker가 없으므로 workerLoading 실행")
    workerLoading()
  }

  /* ✅ 실제 worker를 생성하는 함수 */
  const workerLoading = () => {
    if (typeof window === "undefined" || !window.Worker) {
      console.error("❌ Web Workers를 지원하지 않는 환경입니다.")
      return
    }

    try {
      worker.current = new Worker(
        new URL("/public/workers/object-worker", import.meta.url),
        { type: "module" }
      )
      worker.current.postMessage(1)
      console.log("✅ Worker 생성 성공!!", worker.current)
      // 여기까지 생성되고 리턴됨?
      worker.current.onmessage = async (event) => {
        console.log("📩 Worker Message 받음:", event.data);
        const points = event.data.points
        if (!points || points.length === 0) {
          console.log("⚠️ No points data received.")
          return
        }

        const point = points;
        console.log("✅ point 잘 오는지 확인용", point)
        const level = Math.floor(Math.random() * 3);
        const newTrashItem: ITrashDto = {
          id: idCounter.current++,
          level,
          url: getTrashImage(level),
          rect: {
            x: point.x * 100,
            y: point.y * 100 + (headerHeight / window.innerHeight) * 100,
          },
          isActive: true,
          type: "trash",
        }

        console.log("✅ 새로운 Trash 아이템 추가됨:", newTrashItem);
        addTrashItems(newTrashItem)
        console.log()

        console.log("📤 서버로 Trash 데이터 전송 중...")
        await sendTrashData(newTrashItem)
      }

      worker.current.onerror = (error) => {
        console.error("❌ Worker 오류 발생:", error)
      }
    } catch (error) {
      console.error("❌ Worker 생성 오류:", error)
    }
  }

  /* ✅ 워커 종료 함수 */
  const terminateWorker = () => {
    if (worker.current) {
      console.log("🚨 Worker 종료 중...")
      worker.current.terminate()
      worker.current = null
      console.log("✅ Worker 종료 완료")
    }
  }

  /* ✅ API 요청 함수 */
  const sendTrashData = async (trashData: ITrashDto) => {
    try {
      console.log("✅ API에 Trash 데이터 전송:", trashData);
      const response = await fetch(`/api/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marimoId: 29,
          trashData,
        }),
      })

      if (!response.ok) {
        throw new Error(`🚨 API 요청 실패: ${response.status}`)
      }

      console.log("✅ Trash 데이터 서버에 성공적으로 전송됨.")
    } catch (error) {
      console.error("❌ API 전송 중 오류 발생:", error)
    }
  }

  return { worker, isWorkerRunning, workerLoading, setIsWorkerRunning, initializeWorker, terminateWorker };
}
