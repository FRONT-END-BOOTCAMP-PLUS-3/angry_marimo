import { useEffect } from "react"

export const useWindowEvents = (workerRef: React.MutableRefObject<Worker | null>) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastClosedTime", Date.now().toString())
      workerRef.current?.postMessage("closed")
    }

    const handleLoad = () => {
      const lastClosedTime = localStorage.getItem("lastClosedTime")
      if (lastClosedTime) {
        const elapsed = Date.now() - parseInt(lastClosedTime, 10)
        console.log(`창이 ${elapsed / 1000}초 동안 닫혀있었습니다.`)
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