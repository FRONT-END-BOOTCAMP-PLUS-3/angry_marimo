import { StateCreator } from "zustand"
import { State } from "@marimo/stores/use-store"
import { JsonValue } from "@prisma/client/runtime/client"

export type TTrash = {
  id: number
  level: number
  url: string
  rect: JsonValue
  type: string
  isActive: boolean
}

export interface TTrashSlice {
  trashItems: Omit<TTrash, "id">[] | null

  setTrashItems: (trashItems: TTrash[]) => void
  addTrashItem: (item: Omit<TTrash, "id">) => void
  // closeActive: (id: number) => void
  deleteItem: (id: number) => void
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],

  setTrashItems: (trashItems: TTrash[]) => set({ ...trashItems, trashItems }),

  addTrashItem: (item) => {
    if (!item) return
    set({ trashItems: [...(get().trashItems ?? []), item] })
  },

  closeActive: (id: number) => {
    if (!id) return
    set({
      trashItems: [
        ...(get().trashItems ?? []).map((data) => {
          if (data.isActive === true) {
            return {
              ...data,
              isActive: false,
            }
          }

          return data
        }),
      ],
    })
  },

  deleteItem: (id: number) => {
    set((state) => {
      const updatedTrashItems = [...(state.trashItems ?? [])]
      const index = updatedTrashItems.findIndex(
        (item) => item.id === id && item.isActive,
      )

      if (index !== -1) {
        updatedTrashItems.splice(index, 1)
      }

      return { trashItems: updatedTrashItems }
    })
  },
})
