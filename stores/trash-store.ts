import { StateCreator } from "zustand"
import { State } from "@marimo/stores/use-store"
import { Object as IObject } from "@prisma/client"
import { JsonValue } from "@prisma/client/runtime/client"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

interface ILoadedTrashImage extends ITrashDto {
  image: HTMLImageElement
}

export type TTrash = {
  id: number
  level: number
  url: string
  rect: JsonValue
  type: string
  isActive: boolean
}

export interface TTrashSlice {
  trashItems: TTrash[]
  loadedTrashImages: ILoadedTrashImage[]
  closedItemIds: number[]

  setTrashItems: (trashItems: TTrash[]) => void
  addTrashItems: (item: TTrash) => void
  closeActive: (id: number) => void
  fetchActive: () => Promise<void>
}

export const useTrashStore: StateCreator<
  Partial<State>,
  [],
  [],
  TTrashSlice
> = (set, get) => ({
  trashItems: [],
  loadedTrashImages: [],
  closedItemIds: [],

  setTrashItems: (trashItems: TTrash[]) => {
    set({ trashItems })

    trashItems.forEach((item) => {
      const img = new Image()
      img.src = item.url

      img.onload = () =>
        set((state) => ({
          loadedTrashImages: [
            ...(state.loadedTrashImages ?? []),
            { ...item, image: img },
          ],
        }))
    })
  },

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

      const img = new Image()
      img.src = objectItem.url

      img.onload = () =>
        set((state) => ({
          trashItems: [...(state.trashItems ?? []), objectItem],
          loadedTrashImages: [
            ...(state.loadedTrashImages ?? []),
            { ...objectItem, image: img },
          ],
        }))
    } catch (error) {
      console.error("❌ API 전송 중 오류 발생:", error)
    }
  },

  closeActive: (id: number) => {
    if (!id) return

    set((state) => ({
      closedItemIds: [...(state.closedItemIds ?? []), id],
      trashItems: [
        ...(state.trashItems ?? []).filter((item) => item.id !== id),
      ],
      loadedTrashImages: [
        ...(state.loadedTrashImages ?? []).filter((item) => item.id !== id),
      ],
    }))
  },

  fetchActive: async () => {
    const idList = get().closedItemIds

    const response = await fetch(`/api/objects`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idList,
      }),
    })

    if (!response.ok) {
      console.error("zustand trash-store fetchActive error")
    }

    const failedObjects = (await response.json()) as IObject[]

    set((state) => {
      return {
        closedItemIds: [],
        trashItems: [...(state.trashItems ?? []), ...failedObjects],
      }
    })

    failedObjects.forEach((item) => {
      const img = new Image()
      img.src = item.url

      img.onload = () =>
        set((state) => ({
          loadedTrashImages: [
            ...(state.loadedTrashImages ?? []),
            { ...item, image: img },
          ],
        }))
    })
  },
})
