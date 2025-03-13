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
  isMarimoLoading: boolean
  marimo: TMarimo | null
  setMarimo: (marimo: TMarimo) => void

  marimoImgSrc: string | null
  marimoSrc: string | null
  deadMarimoSrc: string | null
  leftTwerkingMarimoSrc: string | null
  rightTwerkingMarimoSrc: string | null
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
  isMarimoLoading: false,
  marimo: null,
  marimoImgSrc: null,
  marimoSrc: "/images/marimo.svg",
  deadMarimoSrc: "/images/dead-marimo.svg",
  leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
  rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
  intervalId: null as NodeJS.Timeout | null,

  setMarimo: (marimo: TMarimo) =>
    set({
      isMarimoLoading: true,
      marimo,
    }),

  setImages: (
    marimoSrc = "/images/marimo.svg",
    deadMarimoSrc = "/images/dead-marimo.svg",
    leftTwerkingMarimoSrc = "/images/left-twerking-marimo.svg",
    rightTwerkingMarimoSrc = "/images/right-twerking-marimo.svg",
  ) =>
    set((state) => ({
      marimo: {
        ...(state as TMarimo),
        src: marimoSrc,
      },
      marimoSrc,
      deadMarimoSrc,
      leftTwerkingMarimoSrc,
      rightTwerkingMarimoSrc,
    })),

  resetImages: () =>
    set({
      marimoImgSrc: null,
      marimoSrc: "/images/marimo.svg",
      deadMarimoSrc: "/images/dead-marimo.svg",
      leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
      rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
    }),

  updateMarimoStatusAndImgSrc: () => {
    set((state) => {
      console.log(state.trashItems)
      const interval = state.intervalId
      if (interval !== null && interval !== undefined) {
        clearInterval(interval)
      }

      const length = state.trashItems?.length ?? 0
      const marimo = state.marimo

      if (!marimo) return { intervalId: null }

      if (length === 0) {
        let toggle = false
        const newIntervalId = setInterval(() => {
          set({
            marimoImgSrc: toggle
              ? get().leftTwerkingMarimoSrc
              : get().rightTwerkingMarimoSrc,
          })
          toggle = !toggle
        }, 500)

        return {
          marimo: {
            ...marimo,
            status: "happy",
          },
          intervalId: newIntervalId,
        }
      }

      if (length > 30) {
        return {
          marimo: {
            ...marimo,
            status: "dead",
          },
          marimoImgSrc: state.deadMarimoSrc,
          intervalId: null,
        }
      }

      return {
        marimo: {
          ...marimo,
          status: "angry",
        },
        marimoImgSrc: get().marimoSrc,
        intervalId: null,
      }
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

    const trashItems = marimo.objects as IObject[]

    trashItems.forEach((item) => {
      const img = new Image()
      img.src = item.url

      img.onload = () =>
        set((state) => ({
          loadedTrashImages: [
            ...(state.loadedTrashImages ?? []),
            { ...item, image: img },
          ],
        }))
    })

    set({
      marimo,
      trashItems,
      marimoImgSrc: "/images/marimo.svg",
      marimoSrc: "/images/marimo.svg",
      deadMarimoSrc: "/images/dead-marimo.svg",
      leftTwerkingMarimoSrc: "/images/left-twerking-marimo.svg",
      rightTwerkingMarimoSrc: "/images/right-twerking-marimo.svg",
    })
  },
})
