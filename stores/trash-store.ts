import { State } from "./use-store"
import { StateCreator } from "zustand"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export interface TTrashSlice {
  trashItems: ITrashDto | null
  idCounter: number

  findTrashItems: () => ITrashDto | null
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
> = (set, get) => ({
  trashItems: null,
  idCounter: 0,

  findTrashItems: () => {
    return get().trashItems ?? null
  },

  addTrashItems: (item) => {
    set((state) => {
      const currentIdCounter = state.idCounter ?? 0
      return {
        trashItems: { ...item, id: currentIdCounter },
        idCounter: currentIdCounter + 1,
      }
    })
    get().trashItems
  },

  removeTrashItem: () => {
    set({ trashItems: undefined })
  },

  clearAllTrash: () => {
    set({ trashItems: undefined, idCounter: 0 })
  },

  updateTrashItem: (updates) => {
    set((state) => ({
      trashItems: state.trashItems
        ? { ...state.trashItems, ...updates }
        : undefined,
    }))
  },
})

export const selectTrashItemId = (state: TTrashSlice) =>
  state.trashItems?.id ?? null
export const selectIsTrashItemPresent = (state: TTrashSlice) =>
  state.trashItems !== undefined
