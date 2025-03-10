import { StateCreator } from "zustand"
import { State } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export interface TTrashSlice {
  trashItems: ITrashDto[] | null

  addTrashItems: (item: ITrashDto) => void
  closeActive: (id: number) => void
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],

  addTrashItems: (item) => {
    if (!item) return
    set({ trashItems: [...(get().trashItems ?? []), item] })
  },

  closeActive: (id: number) => {
    if (!id) return
    set({
      trashItems: [
        ...(get().trashItems ?? []).map((data) => {
          if (data.id === id) {
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
})
