import { test, expect } from "@playwright/test"

test.describe("Login 페이지 E2E 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/login`)
  })

  test("페이지 요소들이 잘 렌더링 되는지 확인", async ({ page }) => {
    // id="title"인 p 태그가 있는지 확인
    const title = page.locator("#title")
    await expect(title).toBeVisible()

    // p 태그에 "Angry Marimo" 텍스트가 있는지 확인
    await expect(title).toHaveText("Angry Marimo")

    // id="logo"인 이미지가 있는지 확인
    const logoImage = page.locator("#logo")
    await expect(logoImage).toBeVisible()
  })

  test("유효한 토큰이 있는 경우 메인 페이지로 리다이렉션 되는지 확인", async ({
    page,
  }) => {
    const tokenUrl = process.env.COOKIE_DOMAIN!
    const token = process.env.COOKIE_TOKEN!

    await page.context().addCookies([
      {
        name: "token",
        value: token,
        domain: tokenUrl,
        path: "/",
        httpOnly: true,
      },
    ])

    // 로그인 페이지로 이동 - 토큰이 있는 상태로 다시 접속
    await page.goto("/login")

    // 메인 페이지로 이동했는지 확인
    await expect(page).toHaveURL("/")
  })

  test("email 인풋 필드가 제대로 동작하는지 확인", async ({ page }) => {
    const emailInput = page.locator("#email")

    await emailInput.fill("test@example.com")

    await expect(emailInput).toHaveValue("test@example.com")
  })

  test("password 인풋 필드가 제대로 동작하는지 확인", async ({ page }) => {
    const passwordInput = page.locator("#password")

    await passwordInput.fill("password123")

    await expect(passwordInput).toHaveValue("password123")
  })

  test("로그인 후 메인 페이지로 이동하는지 확인", async ({ page }) => {
    await page.locator("#email").fill("test@example.com")
    await page.locator("#password").fill("password123")

    await page.locator('button[name="login"]').click()

    await expect(page).toHaveURL("/") // 메인 페이지 URL로 변경
  })
})
