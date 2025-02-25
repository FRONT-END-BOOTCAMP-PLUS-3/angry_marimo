import pi, { calculatePi } from "@marimo/public/utils/pi"

self.addEventListener("message", (event: MessageEvent<number>) => {
  if (typeof event.data !== "number" || event.data <= 0) {
    console.error("[Worker] 잘못된 입력값:", event.data)
    postMessage({ error: "잘못된 입력값입니다." })
    return
  }

  const startTime = performance.now()

  // 20초 이상 연산 시 타임아웃 처리
  const timeout = setTimeout(() => {
    console.warn(`[Worker] 연산 시간 초과 (20초), 작업 종료`)
    postMessage({ error: "연산 시간이 초과되었습니다." })
    self.close()
  }, 20000)

  try {
    const points = pi(event.data)
    const piValue = calculatePi(points)

    clearTimeout(timeout) // 타임아웃 방지

    const endTime = performance.now()

    postMessage({ points, piValue })
  } catch (error) {
    console.error("[Worker] 연산 중 오류 발생:", error)
    postMessage({ error: "연산 중 오류가 발생했습니다." })
  }
})
