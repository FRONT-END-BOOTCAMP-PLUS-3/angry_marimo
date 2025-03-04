import { test, expect } from "@playwright/test"

test.describe("결제 완료 페이지 E2E 테스트", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "token",
        value: "your_token_value_here",
        domain: "localhost",
        path: "/",
      },
    ])
  })

  test("결제 완료 후 페이지 확인", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/pay/toss/success?orderId=12345&amount=1000&paymentKey=abc123",
    )

    const title = await page.locator("h2")
    await expect(title).toHaveText("결제를 완료했어요")

    await expect(page.locator("text=결제금액")).toBeVisible()
    await expect(page.locator("text=1,000원")).toBeVisible()
    await expect(page.locator("text=주문번호")).toBeVisible()
    await expect(page.locator("text=12345")).toBeVisible()
    await expect(page.locator("text=paymentKey")).toBeVisible()
    await expect(page.locator("text=abc123")).toBeVisible()

    const button = await page.locator('button:text("메인 페이지로 이동")')
    await button.click()
  })

  test("결제 실패 시 실패 페이지로 리다이렉트", async ({ page }) => {
    await page.route("**/api/pay/confirm", (route) => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({
          message: "결제 실패",
          code: "ERROR",
        }),
      })
    })

    await page.goto(
      "http://localhost:3000/pay/toss/success?orderId=12345&amount=1000&paymentKey=abc123",
    )
  })
})
