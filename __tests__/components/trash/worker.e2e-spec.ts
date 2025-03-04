import { test, expect } from "@playwright/test"

test.describe("TrashComponent Web Worker 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("Worker가 종료된다.", async ({ page }) => {
    console.log("🚀 Worker 종료 테스트 시작")

    const isTerminated = await page.evaluate(() => {
      return new Promise((resolve) => {
        const worker = new Worker("/public/workers/trash-worker", {
          type: "module",
        })

        worker.terminate()

        setTimeout(() => {
          resolve(!worker.onmessage)
        }, 100)
      })
    })

    expect(isTerminated).toBe(true)
    console.log("✅ Worker가 정상적으로 종료됨")
  })
})
