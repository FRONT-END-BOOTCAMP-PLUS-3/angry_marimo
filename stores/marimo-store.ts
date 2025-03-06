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
}

// Zustand 스토어 생성을 위한 설정
export const createMarimoSlice: StateCreator<
  Partial<State>,
  [],
  [],
  TMarimoSlice
> = (set) => ({
  marimo: null,

  setMarimo: (marimo: TMarimo) => set({ marimo }),
})
