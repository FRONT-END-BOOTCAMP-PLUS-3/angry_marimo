import pi, { calculatePi } from "@marimo/public/utils/pi"

self.addEventListener("message", (event: MessageEvent<number>) => {
  console.log(`[Worker] 메시지 수신: ${event.data}번 반복`)
  const startTime = performance.now()

  const timeout = setTimeout(() => {
    console.warn(`[Worker] 연산 시간 초과 (20초), 작업 종료`)
    postMessage("연산 종료 (시간 초과)")
    self.close()
  }, 20000)

  const points = pi(event.data)
  const piValue = calculatePi(points)

  clearTimeout(timeout)
  const endTime = performance.now()
  console.log(`[Worker] 연산 완료! 소요 시간: ${endTime}초`)

  postMessage({ points, piValue })
})
