import { it, expect, describe, beforeAll } from "vitest"

class MockWorker {
  // 메시지 이벤트 핸들러 (Worker가 메시지를 받을 때 실행됨)
  onmessage:
    | ((
        event: MessageEvent<{
          points: Array<{ x: number; y: number; isInside: boolean }>
          piValue: number
        }>,
      ) => void)
    | null = null

  // Worker에 메시지를 전송하는 메서드
  postMessage(data: number): void {
    if (this.onmessage) {
      // 가짜 응답 데이터 생성 (data 개수만큼 무작위 좌표 및 isInside 값 생성)
      const points: Array<{ x: number; y: number; isInside: boolean }> =
        Array.from({ length: data }, () => ({
          x: Math.random(),
          y: Math.random(),
          isInside: Math.random() > 0.5,
        }))

      // 메시지 이벤트 객체 생성
      const messageEvent = {
        data: { points, piValue: 3.14 },
      } as MessageEvent<{
        points: Array<{ x: number; y: number; isInside: boolean }>
        piValue: number
      }>

      setTimeout(() => this.onmessage?.(messageEvent), 10)
    }
  }

  terminate(): void {}
}

// Worker 테스트 스위트
describe("Trash Worker 테스트", () => {
  let worker: MockWorker

  beforeAll(() => {
    // 전역 Worker 객체를 MockWorker로 대체
    global.Worker = MockWorker as unknown as typeof Worker

    // MockWorker 인스턴스 생성
    worker = new MockWorker()
  })

  it("Worker가 정상적으로 메시지를 처리하는지 확인", async () => {
    return new Promise<void>((resolve) => {
      // Worker가 메시지를 받았을 때 실행되는 핸들러 설정
      worker.onmessage = (
        event: MessageEvent<{
          points: Array<{ x: number; y: number; isInside: boolean }>
          piValue: number
        }>,
      ) => {
        const result = event.data

        // 결과 검증 (정상적인 데이터 구조 확인)
        expect(result).toBeDefined()
        expect(result).toHaveProperty("points")
        expect(result).toHaveProperty("piValue")
        expect(Array.isArray(result.points)).toBe(true)

        resolve()
      }

      worker.postMessage(1)
    })
  })
})
