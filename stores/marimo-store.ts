import type { StateCreator } from "zustand"

import { State } from "@marimo/stores/use-store"
import { Object as IObject } from "@prisma/client"

export type TMarimo = {
  id: number
  name: string
  userId: number
  size: number
  src: string
  rect: string
  color: string
  status: string
  objects: IObject[]
}

export type TMarimoSlice = {
  marimo: TMarimo | null
  setMarimo: (marimo: TMarimo) => void

  marimoImgSrc: string
  marimoSrc: string
  deadMarimoSrc: string
  leftTwerkingMarimoSrc: string
  rightTwerkingMarimoSrc: string
  intervalId: NodeJS.Timeout | null

  resetMarimoPosition: () => void
  fetchMarimoStatus: () => void
  adoptMarimo: () => Promise<void>

  setImages: (
    marimoSrc: string,
    deadMarimoSrc: string,
    leftTwerkingMarimoSrc: string,
    rightTwerkingMarimoSrc: string,
  ) => void
  resetImages: () => void
  updateMarimoStatusAndImgSrc: () => void
}

// Zustand 스토어 생성을 위한 설정
export const createMarimoSlice: StateCreator<
  Partial<State>,
  [],
  [],
  TMarimoSlice
> = (set, get) => ({
  marimo: null,
  marimoImgSrc: "/images/marimo.svg",
  marimoSrc: "/images/marimo.svg",
  deadMarimoSrc: "/images/dead-marimo.svg",
  leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
  rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
  intervalId: null as NodeJS.Timeout | null,

  setMarimo: (marimo: TMarimo) => set({ marimo, trashItems: marimo.objects }),

  setImages: (
    marimoSrc,
    deadMarimoSrc,
    leftTwerkingMarimoSrc,
    rightTwerkingMarimoSrc,
  ) =>
    set({
      marimo: {
        ...(get().marimo as TMarimo),
        src: marimoSrc,
      },
      marimoSrc,
      deadMarimoSrc,
      leftTwerkingMarimoSrc,
      rightTwerkingMarimoSrc,
    }),

  resetImages: () =>
    set({
      marimoImgSrc: "/images/marimo.svg",
      marimoSrc: "/images/marimo.svg",
      deadMarimoSrc: "/images/dead-marimo.svg",
      leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
      rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
    }),

  updateMarimoStatusAndImgSrc: () => {
    if (!get().trashItems) return

    const interval = get().intervalId
    if (interval !== null && interval !== undefined) {
      clearInterval(interval)
      set({ intervalId: null })
    }

    if (get().trashItems?.length === 0) {
      set({
        marimo: {
          ...(get().marimo as TMarimo),
          status: "happy",
        },
      })

      let toggle = false
      const newIntervalId = setInterval(() => {
        set({
          marimoImgSrc: toggle
            ? get().leftTwerkingMarimoSrc
            : get().rightTwerkingMarimoSrc,
        })
        toggle = !toggle
      }, 500)

      set({ intervalId: newIntervalId })
      return
    }

    if ((get().trashItems?.length as number) > 30) {
      return set({
        marimo: {
          ...(get().marimo as TMarimo),
          status: "dead",
        },

        marimoImgSrc: get().deadMarimoSrc,
      })
    }

    return set({
      marimo: {
        ...(get().marimo as TMarimo),
        status: "angry",
      },

      marimoImgSrc: get().marimoSrc,
    })
  },

  fetchMarimoStatus: async () => {
    const marimo = get().marimo

    if (!marimo) return

    const response = await fetch(`/api/marimo/update/${marimo.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...marimo }),
    })

    if (!response.ok) {
      console.error("Failed to update marimo.")
      return
    }

    const updatedData = await response.json()

    return set({
      marimo: updatedData,
    })
  },

  resetMarimoPosition: () => {
    const interval = get().intervalId
    if (interval !== null && interval !== undefined) {
      clearInterval(interval)
      set({ intervalId: null })
    }

    set({
      marimo: {
        ...get().marimo,
        rect: JSON.stringify({
          x: 50,
          y: 50,
        }),
      } as TMarimo,
    })
  },

  adoptMarimo: async () => {
    const user = get().user

    if (!user) return

    // 새로운 마리모를 생성한다
    const response = await fetch(`/api/marimo/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch create data")
    }

    const marimo = await response.json()

    set({
      marimo,
      trashItems: marimo.objects,
      marimoImgSrc: "/images/marimo.svg",
      marimoSrc: "/images/marimo.svg",
      deadMarimoSrc: "/images/dead-marimo.svg",
      leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
      rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
    })
  },
})
