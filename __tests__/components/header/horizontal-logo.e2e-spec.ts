import { test, expect } from "@playwright/test"

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

test.describe("수평 로고 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("로고를 클릭하면 홈으로 이동해야 한다", async ({ page }) => {
    await page.locator("#logo").click()
    await expect(page).toHaveURL("/")
  })

  test("로고 텍스트를 클릭하면 홈으로 이동해야 한다", async ({ page }) => {
    await page.locator("#title").click()
    await expect(page).toHaveURL("/")
  })
})
