import { test, expect } from "@playwright/test"

test.describe("LoginForm", () => {
  test("로그인 버튼 활성화: 올바른 이메일과 비밀번호 입력시", async ({
    page,
  }) => {
    // 로그인 폼이 렌더링되는 페이지로 이동
    await page.goto("/login")

    // 이메일, 비밀번호 입력 필드, login 버튼 찾기
    const emailInput = page.getByLabel("email")
    const passwordInput = page.getByLabel("password")
    const loginButton = page.getByRole("button", { name: "login" })

    // 초기에는 버튼이 비활성화 상태
    await expect(loginButton).toBeDisabled()

    // 잘못된 이메일 입력 시에도 버튼은 비활성화 상태
    await emailInput.fill("invalid-email")
    await passwordInput.fill("password123")
    await expect(loginButton).toBeDisabled()

    // 올바른 이메일과 비밀번호(8자 초과)를 입력
    await emailInput.fill("test@example.com")
    await passwordInput.fill("password1234")

    // 버튼이 활성화 되었는지 확인합니다.
    await expect(loginButton).toBeEnabled()
  })

  test("URL 쿼리 status=303 일 때 alert 메시지 노출", async ({ page }) => {
    // alert 다이얼로그 이벤트 확인
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("비밀번호가 일치하지 않습니다")
      await dialog.dismiss()
    })

    // 쿼리 파라미터 status=303를 포함하여 페이지에 접근
    await page.goto("/login?status=303")
  })
})
