import { State } from "./use-store"
import { StateCreator } from "zustand"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export interface TTrashSlice {
  trashItems: ITrashDto | null
  idCounter: number

  addTrashItems: (item: Omit<ITrashDto, "id">) => void
  removeTrashItem: () => void
  clearAllTrash: () => void
  updateTrashItem: (updates: Partial<Omit<ITrashDto, "id">>) => void
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set) => ({
  trashItems: null,
  idCounter: 0,

  addTrashItems: (item) => {
    set((state) => {
      const currentIdCounter = state.idCounter ?? 0
      return {
        trashItems: { ...item, id: currentIdCounter },
        idCounter: currentIdCounter + 1,
      }
    })
  },

  removeTrashItem: () => {
    set({ trashItems: null })
  },

  clearAllTrash: () => {
    set({ trashItems: null, idCounter: 0 })
  },

  updateTrashItem: (updates) => {
    set((state) => ({
      trashItems: state.trashItems ? { ...state.trashItems, ...updates } : null,
    }))
  },
})

export const selectTrashItem = (state: TTrashSlice) => state.trashItems
export const selectIsTrashItemPresent = (state: TTrashSlice) =>
  state.trashItems !== null
