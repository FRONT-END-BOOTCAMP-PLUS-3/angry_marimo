import type { StateStorage } from "zustand/middleware"

import { create } from "zustand"
import { TTrashSlice, useTrashStore } from "./trash-store"
import { createSelectorFunctions } from "auto-zustand-selectors-hook"
import { createUserSlice, TUserSlice } from "@marimo/stores/user-store"
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware"

const storage: StateStorage = {
  removeItem: async (name: string): Promise<void> => {
    window.localStorage.removeItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    window.localStorage.setItem(name, JSON.parse(value))
  },
  getItem: async (name: string): Promise<string | null> => {
    const value = window.localStorage.getItem(name)
    return value !== undefined ? JSON.stringify(value) : null
  },
}

export type State = TUserSlice & TTrashSlice

export const useStore = create<State>()(
  subscribeWithSelector(
    persist((...a) => ({ ...createUserSlice(...a), ...useTrashStore(...a) }), {
      version: 144,
      name: "angry_marimo",
      storage: createJSONStorage(() => storage),
      partialize: (keys) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...persistData } = keys

        return persistData
      },
    }),
  ),
)

export const selector = createSelectorFunctions(useStore)
