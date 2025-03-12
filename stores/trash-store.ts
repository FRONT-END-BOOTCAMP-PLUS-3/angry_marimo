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
  trashItems: TTrash[] | null

  setTrashItems: (trashItems: TTrash[]) => void
  addTrashItems: (item: TTrash) => void
  closeActive: (id: number) => void
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],

  setTrashItems: (trashItems: TTrash[]) => set({ trashItems }),

  addTrashItems: (item) => {
    if (!item) return

    const trashItems = [...(get().trashItems ?? []), item]

    set({ trashItems })
  },

  closeActive: async (id: number) => {
    if (!id) return

    const prevItem = get().trashItems?.find((item) => item.id === id)

    if (!prevItem) return

    set({
      trashItems: [
        ...(get().trashItems ?? []).filter((item) => item.id !== id),
      ],
    })

    const response = await fetch(`/api/objects`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })

    if (!response.ok) {
      set({ trashItems: [...(get().trashItems ?? []), prevItem] })
    }
  },
})
