import { useEffect } from "react"

export const useWindowEvents = (workerRef: React.RefObject<Worker | null>) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastClosedTime", Date.now().toString())
      workerRef.current?.postMessage("closed")
    }

    const handleLoad = () => {
      const lastClosedTime = localStorage.getItem("lastClosedTime")
      if (lastClosedTime) {
        const lastClosedDate = new Date(parseInt(lastClosedTime, 10))
        const formattedDate = lastClosedDate.toLocaleString() // 사람이 읽을 수 있는 형식

        const elapsed = Date.now() - lastClosedDate.getTime()
        console.log(`창이 ${elapsed / 1000}초 동안 닫혀있었습니다. (마지막 종료 시간: ${formattedDate})`)

        if (elapsed > 5000) {
          console.log("💡 5초 이상 닫혀 있었으므로 특정 객체 생성")
        }
      }
      workerRef.current?.postMessage("opened")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("load", handleLoad)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("load", handleLoad)
    }
  }, [workerRef])
}