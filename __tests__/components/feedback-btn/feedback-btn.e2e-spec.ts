import { test, expect } from "@playwright/test"

test.describe(`feedback_id`, () => {
  const pageUrl = "/"
  test(`feedback_id`, async ({ page }) => {
    await page.goto(pageUrl)
    await expect(page.getByLabel("feedback_id")).not.toBeVisible()
  })
})
