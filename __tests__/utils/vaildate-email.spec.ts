import { validateEmail } from "@marimo/utils/validate-email"

import { describe, test, expect } from "vitest"

describe("validateEmail", () => {
  test("should return true for valid email addresses", () => {
    expect(validateEmail("test@example.com")).toBe(true)
    expect(validateEmail("user.name@domain.co")).toBe(true)
    expect(validateEmail("user_name123@sub.domain.com")).toBe(true)
  })

  test("should return false for invalid email addresses", () => {
    expect(validateEmail("plainaddress")).toBe(false)
    expect(validateEmail("missing@domain")).toBe(false)
    expect(validateEmail("missing@.com")).toBe(false)
    expect(validateEmail("@missingusername.com")).toBe(false)
    expect(validateEmail("user@domain..com")).toBe(false)
  })
})
