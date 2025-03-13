import { getTrashImage } from "@marimo/public/utils/level-image"
import { randomLocation } from "@marimo/public/utils/random-location"

import { HEADER_HEIGHT } from "@marimo/constants/trash-header"

import { Marimo } from "@prisma/client"

self.addEventListener(
  "message",
  (
    event: MessageEvent<{
      itemCount: number
      marimo: Marimo
      windowHeight: number
    }>,
  ) => {
    const { windowHeight } = event.data
    const headerHeight = HEADER_HEIGHT

    const second = 1440000
    let interval: string | number | NodeJS.Timeout | undefined

    clearInterval(interval)

    const startInterval = () => {
      clearInterval(interval)
      interval = setInterval(async () => {
        const point = randomLocation(1)[0]
        const level = Math.floor(Math.random() * 3) + 1

        const newTrashItem = {
          level,
          url: getTrashImage(level),
          rect: {
            x: point.x * 70,
            y: point.y * 70 + (headerHeight / windowHeight) * 100,
          },
          isActive: true,
          type: "trash",
        }

        postMessage(newTrashItem)
      }, second)
    }

    startInterval()
  },
)
