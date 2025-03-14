import { getTrashImage } from "@marimo/public/utils/level-image"
import { randomLocation } from "@marimo/public/utils/random-location"

import { HEADER_HEIGHT } from "@marimo/constants/trash-header"

let interval: string | number | NodeJS.Timeout | undefined

self.addEventListener(
  "message",
  (
    event: MessageEvent<{
      message: string
      windowHeight?: number
      second?: number
    }>,
  ) => {
    try {
      const { message, windowHeight, second } = event.data

      if (message === "start" && windowHeight && second) {
        const headerHeight = HEADER_HEIGHT

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
      }

      if (message === "stop") {
        clearInterval(interval)
      }
    } catch (error) {
      console.error("❌ postMessage error in worker:", error)
    }
  },
)
