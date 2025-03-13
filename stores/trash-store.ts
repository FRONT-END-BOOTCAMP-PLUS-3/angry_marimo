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

  addTrashItems: async (newTrashItem) => {
    if (!get().marimo) return

    try {
      const response = await fetch(`/api/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marimoId: get().marimo?.id,
          trashData: newTrashItem,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`🚨 API 요청 실패: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const objectItem = data.objectItem
      const trashItems = [...(get().trashItems ?? []), objectItem]

      set({ trashItems })
    } catch (error) {
      console.error("❌ API 전송 중 오류 발생:", error)
    }
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

    console.log("response --> ", response)

    if (!response.ok) {
      set({ trashItems: [...(get().trashItems ?? []), prevItem] })
    }
  },
})
