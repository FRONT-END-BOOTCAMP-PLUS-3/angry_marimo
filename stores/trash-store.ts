import { State } from "./use-store"
import { StateCreator } from "zustand"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

export interface TTrashSlice {
  trashItems: ITrashDto[]
  idCounter: number

  addTrashItems: (items: Omit<ITrashDto, "id">[]) => void
  removeTrashItem: (id: number) => void
  clearAllTrash: () => void
  updateTrashItem: (id: number, updates: Partial<Omit<ITrashDto, "id">>) => void
  getTrashById: (id: number) => ITrashDto | undefined
  getTrashByLevel: (level: number) => ITrashDto[]
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],
  idCounter: 0,

  addTrashItems: (items) => {
    set((state) => {
      const currentIdCounter = state.idCounter ?? 0 // undefined 방지
      const newItems = items.map((item, index) => ({
        ...item,
        id: currentIdCounter + index, // 고유 ID 생성
      }))

      return {
        trashItems: [...(state.trashItems || []), ...newItems], // undefined 방지
        idCounter: currentIdCounter + items.length, // ID 카운터 업데이트
      }
    })
  },

  removeTrashItem: (id) => {
    set((state) => ({
      trashItems: (state.trashItems || []).filter((item) => item.id !== id),
    }))
  },

  clearAllTrash: () => {
    set({ trashItems: [], idCounter: 0 })
  },

  updateTrashItem: (id, updates) => {
    set((state) => ({
      trashItems: (state.trashItems || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }))
  },

  getTrashById: (id) => {
    return (get().trashItems || []).find((item) => item.id === id)
  },

  getTrashByLevel: (level) => {
    return (get().trashItems || []).filter((item) => item.level === level)
  },
})

export const selectAllTrash = (state: TTrashSlice) => state.trashItems
export const selectTrashCount = (state: TTrashSlice) => state.trashItems.length
export const selectTrashByLevel = (level: number) => (state: TTrashSlice) =>
  state.trashItems.filter((item) => item.level === level)
