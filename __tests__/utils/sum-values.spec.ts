import { sumValues } from "@marimo/utils/sum-values"

import { describe, test, expect } from "vitest"

describe("sumValues", () => {
  test("빈 배열이 주어지면 0을 반환해야 한다", () => {
    const result = sumValues([])
    expect(result).toBe(0)
  })

  test("숫자 배열이 주어지면 합계를 반환해야 한다", () => {
    const result = sumValues([1, 2, 3, 4, 5])
    expect(result).toBe(15)
  })

  test("음수 값이 포함된 배열에서 합계를 반환해야 한다", () => {
    const result = sumValues([-1, -2, 3, 4])
    expect(result).toBe(4)
  })

  test("단일 숫자가 배열로 주어지면 그 숫자 자체를 반환해야 한다", () => {
    const result = sumValues([10])
    expect(result).toBe(10)
  })
})
