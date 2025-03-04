import { create, StateCreator } from "zustand"
import { State } from "./use-store"

export type TTrashItem = {
  id: number
  level: number
  url: string
  x: number
  y: number
}

export interface TrashStore {
  trashItems: TTrashItem[]
  idCounter: number

  addTrashItems: (items: Omit<TTrashItem, "id">[]) => void
  removeTrashItem: (id: number) => void
  clearAllTrash: () => void
  updateTrashItem: (
    id: number,
    updates: Partial<Omit<TTrashItem, "id">>,
  ) => void
  getTrashById: (id: number) => TTrashItem | undefined
  getTrashByLevel: (level: number) => TTrashItem[]
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TrashStore
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
        item.id === id ? { ...item, ...updates } : item
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

export const selectAllTrash = (state: TrashStore) => state.trashItems
export const selectTrashCount = (state: TrashStore) => state.trashItems.length
export const selectTrashByLevel = (level: number) => (state: TrashStore) =>
  state.trashItems.filter((item) => item.level === level)