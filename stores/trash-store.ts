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

  setTrashItems: (trashItems: Omit<TTrash, "id">[]) => void
  addTrashItem: (item: Omit<TTrash, "id">) => void
  deleteItem: (id: number) => void
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],

  setTrashItems: (trashItems: Omit<TTrash, "id">[]) => set({ trashItems: trashItems }),

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
      // trashItems 에 id 가 없음. id 를 어떻게 넣어줘야 하는지 고민해보기
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
