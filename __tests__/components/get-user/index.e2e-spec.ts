import { test, expect } from "@playwright/test"

test("사용자 정보가 없을 경우 로그인 페이지로 리디렉션된다", async ({
  page,
}) => {
  await page.goto("/")

  // 서버에서 반환할 API 응답 mock 설정 (200이 아닌 상태)
  await page.route("/api/user", (route) =>
    route.fulfill({
      status: 401, // 401 에러 응답 (로그인 실패)
      body: JSON.stringify({}),
    }),
  )

  await expect(page).toHaveURL("/login") // 로그인 페이지로 리디렉션 확인
})
