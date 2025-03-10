import { StateCreator } from "zustand"
import { State } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export interface TTrashSlice {
  trashItem: ITrashDto | null
  trashItems: ITrashDto[] | null

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
  trashItem: null,
  trashItems: [],

  findTrashItems: () => {
    return get().trashItem ?? null
  },

  addTrashItems: (item) => {
    if (!item) return

    set((state) => {
      const newId = (state.trashItems ?? []).length + 1
      const newItem: ITrashDto = { ...item, id: newId }

      return {
        trashItem: newItem,
        trashItems: [...(state.trashItems ?? []), newItem],
      }
    })
  },

  removeTrashItem: () => {
    const currentItem = get().trashItem
    if (!currentItem) return

    set((state) => ({
      trashItem: null,
      trashItems: (state.trashItems ?? []).filter(
        (item) => item.id !== currentItem.id,
      ),
    }))
  },

  clearAllTrash: () => {
    if ((get().trashItems ?? []).length === 0) return
    set({ trashItems: [], trashItem: null })
  },

  updateTrashItem: (updates) => {
    const currentItem = get().trashItem
    if (!currentItem) return

    set((state) => ({
      trashItem: { ...currentItem, ...updates },
      trashItems: (state.trashItems ?? []).map((item) =>
        item.id === currentItem.id ? { ...item, ...updates } : item,
      ),
    }))
  },
})

export const selectTrashItemId = (state: TTrashSlice) =>
  state.trashItem?.id ?? null

export const selectIsTrashItemPresent = (state: TTrashSlice) =>
  (state.trashItems ?? []).length > 0
