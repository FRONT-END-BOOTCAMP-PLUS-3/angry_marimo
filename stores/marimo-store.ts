import type { StateCreator } from "zustand"

import { State } from "@marimo/stores/use-store"

export type TMarimo = {
  id: number
  name: string
  userId: number
  size: number
  src: string
  rect: string
  color: string
  status: string
}

export type TMarimoSlice = {
  marimo: TMarimo | null
  setMarimo: (marimo: TMarimo) => void

  marimoImgSrc: string
  marimoSrc: string
  deadMarimoSrc: string
  leftTwerkingMarimoSrc: string
  rightTwerkingMarimoSrc: string

  setImages: (
    marimoSrc: string,
    deadMarimoSrc: string,
    leftTwerkingMarimoSrc: string,
    rightTwerkingMarimoSrc: string,
  ) => void
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

  setMarimo: (marimo: TMarimo) => set({ marimo }),

  setImages: (
    marimoSrc,
    deadMarimoSrc,
    leftTwerkingMarimoSrc,
    rightTwerkingMarimoSrc,
  ) =>
    set({
      marimoSrc,
      deadMarimoSrc,
      leftTwerkingMarimoSrc,
      rightTwerkingMarimoSrc,
    }),

  updateMarimoStatusAndImgSrc: () => {
    if (!get().trashItems) return

    if (get().trashItems?.length === 0) {
      return set({
        marimo: {
          ...(get().marimo as TMarimo),
          status: "happy",
        },

        marimoImgSrc: get().leftTwerkingMarimoSrc,
      })
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

  changeMarimo: async () => {
    // 기존 마리모의 상태를 dead로 업데이트 한다
    // const fetchedMarimo = await fetch('/api/marimo', { method : "PUT", data : {status : 'dead'}})
    // 새로운 마리모를 생성한다
    // const response = await fetch('/api/marimo', { method : "POST", data : {status : 'angry'}})
    // 새로운 마리모가 잘 만들어졌는 지 확인한다
    // if(!response.ok) alert("다시 시도해주세요?")
    // 두 패치가 잘 됐으면 주스탄드 업데이트
    // const marimo = await response.json()
    // set({ marimo, trashItems : [] })
  },
})
