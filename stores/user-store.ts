import type { StateCreator } from "zustand"

import { State } from "@marimo/stores/use-store"

export type TUser = {
  id: number
  name: string
  email: string
}

export type TUserSlice = {
  user: TUser | null
  setUser: (user: TUser) => void
  clearUser: () => void
}

export const createUserSlice: StateCreator<
  Partial<State>,
  [],
  [],
  TUserSlice
> = (set, get) => ({
  user: null,

  setUser: (user: TUser) => set({ user }),
  clearUser: () => set({ user: null }),
})
