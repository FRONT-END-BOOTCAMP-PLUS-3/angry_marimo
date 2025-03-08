import { test, expect } from "@playwright/test"

// TODO : 마리모 꾸미러 가기 버튼에 대한 테스트 추가
test.describe("결제 완료 페이지 E2E 테스트", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "token",
        value: process.env.COOKIE_TOKEN!,
        domain: "localhost",
        path: "/",
      },
    ])
  })

  test("결제 완료 후 페이지 확인 (API 모킹)", async ({ page }) => {
    const marimoId = "12345"
    const orderId = "12345"
    const amount = "1000"
    const paymentKey = "abc123"

    // ✅ API 응답을 모킹하여 즉시 반환
    await page.route("/api/pay/confirm", async (route) => {
      console.log("✅ /api/pay/confirm 모킹 응답 반환")
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          balanceAmount: amount,
          paymentKey: paymentKey,
        }),
      })
    })

    await page.route("/api/pay/order", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    })

    await page.goto(
      `http://localhost:3000/pay/toss/success/${marimoId}?orderId=${orderId}&amount=${amount}&paymentKey=${paymentKey}`,
    )

    // 1️⃣ 결제 중 메시지 확인
    await expect(page.locator("h2")).toHaveText(
      "결제 중 입니다! 잠시 기다려주세요...",
    )

    await page
      .locator("text=결제를 완료했어요")
      .waitFor({ state: "visible", timeout: 10000 })

    // 2️⃣ 모킹된 API 응답이 적용되었으므로 즉시 결제 완료 페이지 표시
    await expect(page.locator("text=결제를 완료했어요")).toBeVisible()

    // 3️⃣ 결제 상세 정보 확인
    await expect(page.locator("text=결제금액")).toBeVisible()
    await expect(
      page.locator(`text=${Number(amount).toLocaleString()}원`),
    ).toBeVisible()
    await expect(page.locator("text=주문번호")).toBeVisible()
    await expect(page.locator(`text=${orderId}`)).toBeVisible()
    await expect(page.locator("text=paymentKey")).toBeVisible()
    await expect(page.locator(`text=${paymentKey}`)).toBeVisible()

    // 4️⃣ "메인 페이지로 이동" 버튼 클릭 후 이동 확인
    const mainButton = page.locator('button:text("메인 페이지로 이동")')
    await mainButton.click()
    await expect(page).toHaveURL("http://localhost:3000/")

    // 5️⃣ "마리모 꾸미러 가기" 버튼 클릭 후 이동 확인
    await page.goto(
      `http://localhost:3000/pay/toss/success/${marimoId}?orderId=${orderId}&amount=${amount}&paymentKey=${paymentKey}`,
    )

    const customButton = page.locator('button:text("마리모 꾸미러 가기")')
    await customButton.click()
    await expect(page).toHaveURL("http://localhost:3000/custom")
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
