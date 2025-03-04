import { extractNumber } from "@marimo/utils/extract-number"

import { describe, test, expect } from "vitest"

describe("extractNumber", () => {
  test("숫자만 포함된 문자열에서 숫자를 추출해야 한다", () => {
    const result = extractNumber("123456")
    expect(result).toBe(123456)
  })

  test("문자와 숫자가 혼합된 문자열에서 숫자를 추출해야 한다", () => {
    const result = extractNumber("abc1234xyz")
    expect(result).toBe(1234)
  })

  test("숫자가 없는 문자열에서 0을 반환해야 한다", () => {
    const result = extractNumber("abcxyz")
    expect(result).toBe(0)
  })

  test("숫자 앞뒤에 공백이 있을 때 공백을 제거하고 숫자를 반환해야 한다", () => {
    const result = extractNumber("   56789   ")
    expect(result).toBe(56789)
  })

  test("특수문자가 포함된 문자열에서 숫자를 추출해야 한다", () => {
    const result = extractNumber("!@#9876$%^")
    expect(result).toBe(9876)
  })

  test("빈 문자열이 주어지면 0을 반환해야 한다", () => {
    const result = extractNumber("")
    expect(result).toBe(0)
  })
})
