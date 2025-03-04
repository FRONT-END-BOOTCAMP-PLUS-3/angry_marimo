import { isEnglishAndNumber } from "@marimo/utils/is-eng-and-num"

import { describe, test, expect } from "vitest" // 파일 경로를 실제 위치에 맞게 수정하세요

describe("isEnglishAndNumber", () => {
  test('should return true for strings with only English letters, numbers, "@" and "."', () => {
    expect(isEnglishAndNumber("HelloWorld")).toBe(true)
    expect(isEnglishAndNumber("Hello123")).toBe(true)
    expect(isEnglishAndNumber("test@example.com")).toBe(true)
    expect(isEnglishAndNumber("abcXYZ")).toBe(true)
    expect(isEnglishAndNumber("123456")).toBe(true)
  })

  test("should return false for strings containing disallowed characters", () => {
    expect(isEnglishAndNumber("Hello World")).toBe(false) // 공백 포함
    expect(isEnglishAndNumber("Hello-World")).toBe(false) // 하이픈 포함
    expect(isEnglishAndNumber("test@example,com")).toBe(false) // 콤마 포함
    expect(isEnglishAndNumber("test!")).toBe(false) // 특수문자 포함
    expect(isEnglishAndNumber("한글")).toBe(false) // 한글 포함
  })

  test("should return false for an empty string", () => {
    expect(isEnglishAndNumber("")).toBe(false)
  })
})
