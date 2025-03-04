import { test, expect } from "@playwright/test"

test.describe("결제 실패 페이지 E2E 테스트", () => {
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

  test("에러 메시지와 코드가 정상적으로 표시되는지 확인", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/pay/toss/fail?message=결제%20실패&code=ERROR",
    )

    const title = await page.locator("h2")
    await expect(title).toHaveText("결제를 실패했어요")

    const errorMessage = await page.locator("#message")
    await expect(errorMessage).toHaveText("결제 실패")

    const errorCode = await page.locator("#code")
    await expect(errorCode).toHaveText("ERROR")
  })

  test("메인 페이지로 이동 버튼 클릭 시 페이지가 이동하는지 확인", async ({
    page,
  }) => {
    await page.goto(
      "http://localhost:3000/pay/toss/fail?message=결제%20실패&code=ERROR",
    )

    const button = await page.locator('button:text("메인 페이지로 이동")')
    await button.click()

    await expect(page).toHaveURL("http://localhost:3000")
  })
})
