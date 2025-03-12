"use client"

import dynamic from "next/dynamic"

import React, { useState, useEffect, useRef } from "react"

import { Loading } from "@marimo/components/loading"

import { remToPx } from "@marimo/utils/rem-to-px"

import styles from "@marimo/components/canvas/index.module.css"

import { useStore } from "@marimo/stores/use-store"
import { ITrashDto } from "@marimo/application/usecases/object/dto/trash-dto"

interface ILoadedTrashImage extends ITrashDto {
  image: HTMLImageElement
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)
  const [marimoImageLoaded, setMarimoImageLoaded] = useState(false)
  const [loadedTrashImages, setLoadedTrashImages] = useState<
    ILoadedTrashImage[]
  >([])

  const [marimoPosition, setMarimoPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(new Image())
  const [bounce, setBounce] = useState(0)
  const [velocity, setVelocity] = useState(0.5)
  const {
    user,
    marimo,
    setMarimo,
    trashItems,
    closeActive,
    marimoImgSrc,
    updateMarimoStatusAndImgSrc,
    resetMarimoPosition,
    fetchMarimoStatus,
    adoptMarimo,
  } = useStore()
  const [marimoSizePx, setMarimoSizePx] = useState(80)

  const [isEscape, setIsEscape] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  useEffect(() => {
    if (!marimo || !marimo.size) return
    const newSize = remToPx(marimo.size, canvasWidth)
    setMarimoSizePx(newSize)
  }, [marimo?.size, canvasWidth])

  const handleCanvasResize = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }

  const animateMarimo = () => {
    if (marimo?.status === "dead") {
      setBounce(0) // 죽은 상태일 때 bounce 제거
      return
    }

    if (!isDragging && canvasRef.current) {
      const newBounce = bounce + velocity
      if (newBounce > 12 || newBounce < -12) {
        setVelocity(-velocity)
      } else {
        setBounce(newBounce)
      }

      requestAnimationFrame(animateMarimo)
    }
  }

  useEffect(() => {
    updateMarimoStatusAndImgSrc()
    fetchMarimoStatus()
  }, [trashItems?.length])

  useEffect(() => {
    if (!isDragging) {
      const animationFrameId = requestAnimationFrame(animateMarimo)
      return () => cancelAnimationFrame(animationFrameId)
    }
  }, [isDragging, bounce, velocity])

  const loadMarimoImage = () => {
    const marimoImage = imageRef.current
    marimoImage.src = marimoImgSrc
    marimoImage.onload = () => setMarimoImageLoaded(true)
    marimoImage.onerror = () => console.error("Failed to load image")
  }
  const loadTrashImages = () => {
    if (!trashItems) return
    setLoadedTrashImages([])
    trashItems.forEach((item) => {
      const img = new Image()
      img.src = item.url
      img.onload = () =>
        setLoadedTrashImages((prev) => [...prev, { ...item, image: img }])
    })
  }

  useEffect(() => {
    loadMarimoImage()
  }, [marimoImgSrc])

  useEffect(() => {
    loadTrashImages()
  }, [trashItems])

  const drawOnCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        if (marimoImageLoaded && marimo && marimoPosition) {
          ctx.drawImage(
            imageRef.current,
            marimoPosition.x,
            marimoPosition.y + bounce,
            marimoSizePx,
            marimoSizePx,
          )
        }
        loadedTrashImages.forEach((trash) => {
          if (!trash.rect) {
            console.error("rect 정보가 없습니다:", trash)
            return
          }
          const rect = trash.rect as { x: number; y: number }
          const x = (rect.x / 100) * canvasWidth
          const y = (rect.y / 100) * canvasHeight
          if (trash.isActive && marimoPosition) {
            if (isColliding(marimoPosition, { x, y, width: 50, height: 50 })) {
              trash.isActive = false
              closeActive(trash.id)
            } else {
              ctx.drawImage(trash.image, x, y, 50, 50)
            }
          }
        })

        setIsLoading(false)
      }
    }
  }
  const isColliding = (
    marimoPosition: { x: number; y: number },
    trashPosition: { x: number; y: number; width: number; height: number },
  ) => {
    if (!marimo) return
    return !(
      marimoPosition.x + marimoSizePx < trashPosition.x ||
      marimoPosition.x > trashPosition.x + trashPosition.width ||
      marimoPosition.y + marimoSizePx < trashPosition.y ||
      marimoPosition.y > trashPosition.y + trashPosition.height
    )
  }
  useEffect(() => {
    if (!canvasWidth || !canvasHeight || !marimoPosition) return

    drawOnCanvas()

    if (
      marimoPosition.x < -marimoSizePx ||
      marimoPosition.x > canvasWidth ||
      marimoPosition.y < -marimoSizePx ||
      marimoPosition.y > canvasHeight - marimoSizePx
    ) {
      setIsEscape(true)
    } else {
      setIsEscape(false)
    }
  }, [
    marimoPosition,
    marimoImageLoaded,
    loadedTrashImages,
    canvasWidth,
    canvasHeight,
    marimoSizePx,
    bounce,
  ])

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !marimo) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (
      marimoPosition &&
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSizePx &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSizePx
    ) {
      setIsDragging(true)
      setStartPosition({ x: x - marimoPosition.x, y: y - marimoPosition.y })
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !marimo) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (
      marimoPosition &&
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSizePx &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSizePx
    ) {
      canvas.style.cursor = "pointer"
    } else {
      canvas.style.cursor = "default"
    }

    if (isDragging) {
      const newX = Math.min(
        Math.max(0, x - startPosition.x),
        canvasWidth - marimoSizePx,
      )
      const newY = Math.min(
        Math.max(0, y - startPosition.y),
        canvasHeight - 200,
      )
      setMarimoPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    updateMarimo()
    setIsDragging(false)
  }

  const fetchMarimo = async () => {
    if (!user) {
      console.error("User is null")
      return
    }

    try {
      const response = await fetch(`/api/marimo/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()

      setMarimo({
        ...data.user,
      })
      updateMarimoStatusAndImgSrc()
      fetchMarimoStatus()
    } catch (error) {
      console.error("API Error:", error)
    }
  }

  const updateMarimo = async () => {
    if (!marimoPosition) return
    const updatedRect = JSON.stringify({
      x: (marimoPosition.x * 100) / canvasWidth,
      y: (marimoPosition.y * 100) / canvasHeight,
    })
    if (!marimo) {
      console.error("Marimo is null")
      return
    }
    const response = await fetch(`/api/marimo/update/${marimo.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...marimo, rect: updatedRect }),
    })

    if (!response.ok) {
      console.error("Failed to update marimo.")
      return
    }

    const updatedData = await response.json()
    setMarimo(updatedData)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !marimo) return
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    if (
      marimoPosition &&
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSizePx &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSizePx
    ) {
      setIsDragging(true)
      setStartPosition({ x: x - marimoPosition.x, y: y - marimoPosition.y })
    }
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!isDragging) return
    const touch = event.touches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const newX = x - startPosition.x
    const newY = y - startPosition.y
    setMarimoPosition({ x: newX, y: newY })
  }

  const handleTouchEnd = () => {
    updateMarimo()
    setIsDragging(false)
  }

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await updateMarimo()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchMarimo()
    }
  }, [user])

  useEffect(() => {
    if (marimo && marimo.rect) {
      const rectObject = JSON.parse(marimo.rect)
      const percentagedX = (canvasWidth * rectObject.x) / 100
      const percentagedY = (canvasHeight * rectObject.y) / 100
      setMarimoPosition({ x: percentagedX, y: percentagedY })
    }
  }, [marimo])

  return (
    <div>
      {isLoading && <Loading />}
      {marimo?.status === "dead" && (
        <div className={styles.button__div}>
          <button
            onClick={(event) => {
              event.preventDefault()

              adoptMarimo()
            }}
            className={styles.common_button}
          >
            새 마리모 입양하기
          </button>
        </div>
      )}

      {isEscape && (
        <div className={styles.button__div}>
          <button
            onClick={(event) => {
              event.preventDefault()

              setIsEscape(false)
              resetMarimoPosition()
            }}
            className={styles.common_button}
          >
            마리모 중앙으로 불러오기
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}

const DynamicCanvas = dynamic(() => Promise.resolve(Canvas), {
  ssr: false,
})

export default DynamicCanvas
