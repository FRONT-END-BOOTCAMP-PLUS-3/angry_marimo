import { test, expect } from "@playwright/test"

test.describe("드롭다운 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태를 위한 쿠키 설정 (예제)
    await page
      .context()
      .addCookies([{ name: "token", value: "test-token", url: "/" }])

    await page.goto("/")
  })

  test("드롭다운 버튼을 클릭하면 메뉴가 열려야 한다", async ({ page }) => {
    await page.locator("button", { hasText: "님" }).click()
    await expect(page.locator("text=새 마리모 만들기")).toBeVisible()
  })

  test("'마리모팀 후원하기' 버튼 클릭 시 /pay로 이동해야 한다", async ({
    page,
  }) => {
    await page.locator("button", { hasText: "님" }).click()
    await page.locator("text=마리모팀 후원하기").click()
    await expect(page).toHaveURL("/")
  })

  test("'로그아웃' 버튼 클릭 시 /login으로 이동해야 한다", async ({ page }) => {
    await page.locator("button", { hasText: "님" }).click()
    await page.locator("text=로그아웃").click()
    await expect(page).toHaveURL("/")
  })
})
