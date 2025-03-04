import { getWarningMsg } from "@marimo/utils/get-warning-msg"

import { describe, test, expect } from "vitest"
import {
  EMAIL_EXIST,
  EMAIL_FORM_VALIDATION_TEXT,
  PASSWORD_VALIDATION_TEXT,
} from "@marimo/constants"

describe("getWarningMsg", () => {
  describe("email type", () => {
    test("should return EMAIL_FORM_VALIDATION_TEXT when email format is invalid", () => {
      // "invalid-email"는 @나 .이 없으므로 validateEmail이 false를 반환함
      const result = getWarningMsg("email", "invalid-email")
      expect(result).toBe(EMAIL_FORM_VALIDATION_TEXT)
    })

    test("should return EMAIL_EXIST when email passes basic format but contains disallowed characters", () => {
      // "test@exámple.com"는 기본 이메일 형식은 맞지만, isEnglishAndNumber에서 허용하지 않는 문자가 포함되어 있음
      const result = getWarningMsg("email", "test@exámple.com")
      expect(result).toBe(EMAIL_EXIST)
    })

    test("should return undefined when email is valid and contains only allowed characters", () => {
      const result = getWarningMsg("email", "test@example.com")
      expect(result).toBeUndefined()
    })
  })

  describe("password type", () => {
    test("should return PASSWORD_VALIDATION_TEXT when password is less than 8 characters", () => {
      const result = getWarningMsg("password", "1234567")
      expect(result).toBe(PASSWORD_VALIDATION_TEXT)
    })

    test("should return undefined when password is 8 characters or longer", () => {
      const result = getWarningMsg("password", "12345678")
      expect(result).toBeUndefined()
    })
  })
})
