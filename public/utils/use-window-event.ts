"use client"
import { useEffect } from "react"

export const useWindowEvents = (worker: React.RefObject<Worker | null>) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const formattedTime = new Date(Date.now()).toLocaleString()
      localStorage.setItem("lastClosedTime", formattedTime)

      worker.current?.postMessage("closed")
    }

    const handleLoad = () => {
      const lastClosedTime = localStorage.getItem("lastClosedTime")
      if (lastClosedTime) {
        const lastClosedDate = new Date(parseInt(lastClosedTime, 10))
        const formattedDate = lastClosedDate.toLocaleString()

        const elapsed = Date.now() - lastClosedDate.getTime()
        console.log(
          `창이 ${elapsed / 1000}초 동안 닫혀있었습니다. (마지막 종료 시간: ${formattedDate})`,
        )

        if (elapsed > 60 * 60 * 1000) {
          console.log(
            "💡 1시간 이상 닫혀 있었으므로 특정 객체 생성--루트 생성하기",
          )
        }
      }
      worker.current?.postMessage("opened")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("load", handleLoad)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("load", handleLoad)
    }
  }, [worker])
}
