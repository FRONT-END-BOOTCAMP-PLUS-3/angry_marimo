import { uuidGenerator } from "@marimo/utils/uuid_generator"

import { test, describe, expect } from "vitest"

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe("uuidGenerator", () => {
  test("유효한 UUID v4를 생성해야 한다", () => {
    const uuid = uuidGenerator()
    expect(uuid).toMatch(UUID_V4_REGEX)
  })

  test("UUID는 고유해야 한다", () => {
    const uuid1 = uuidGenerator()
    const uuid2 = uuidGenerator()
    expect(uuid1).not.toBe(uuid2)
  })
})
