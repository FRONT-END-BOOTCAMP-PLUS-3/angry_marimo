import { formatMoney } from "@marimo/utils/format-money"

import { describe, test, expect } from "vitest"

describe("formatMoney", () => {
  test("숫자 문자열을 정상적으로 포맷해야 한다", () => {
    const result = formatMoney("1234567")
    expect(result).toBe("1,234,567")
  })

  test("문자와 숫자가 혼합된 문자열을 처리해야 한다", () => {
    const result = formatMoney("abc1234xyz")
    expect(result).toBe("1,234")
  })

  test("0이 여러 번 있는 경우 앞의 0을 제거해야 한다", () => {
    const result = formatMoney("00001234")
    expect(result).toBe("1,234")
  })

  test('빈 문자열이 주어지면 "0"을 반환해야 한다', () => {
    const result = formatMoney("")
    expect(result).toBe("0")
  })

  test("특수문자가 포함된 문자열을 처리해야 한다", () => {
    const result = formatMoney("!@#1234$%^")
    expect(result).toBe("1,234")
  })

  test("숫자 앞에 공백이 있을 때 공백을 제거해야 한다", () => {
    const result = formatMoney("  987 654 321  ")
    expect(result).toBe("987,654,321")
  })
})
