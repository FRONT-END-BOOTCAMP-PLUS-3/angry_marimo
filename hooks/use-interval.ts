import { useEffect, useRef } from "react"

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)
  console.log("✅ useInterval 호출 완료!!")
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const tick = () => {
      if (savedCallback.current) savedCallback.current()
    }

    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}
