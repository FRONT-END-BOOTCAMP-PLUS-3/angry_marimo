"use client"

import dynamic from "next/dynamic"

import React, { useState, useEffect, useRef } from "react"

import { Loading } from "@marimo/components/loading"

import { remToPx } from "@marimo/utils/rem-to-px"

import styles from "@marimo/components/canvas/index.module.css"

import { useStore } from "@marimo/stores/use-store"

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)

  const [marimoImageLoaded, setMarimoImageLoaded] = useState(false)

  const [marimoPosition, setMarimoPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(new Image())
  const [bounce, setBounce] = useState(0)
  const [velocity, setVelocity] = useState(0.5)
  const [marimoSizePx, setMarimoSizePx] = useState(80)

  const [isDragging, setIsDragging] = useState(false)
  const [isEscape, setIsEscape] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const {
    marimo,
    setMarimo,
    trashItems,
    closeActive,
    marimoImgSrc,
    loadedTrashImages,
    updateMarimoStatusAndImgSrc,
    resetMarimoPosition,
    fetchMarimoStatus,
    setTrashItems,
    adoptMarimo,
    setImages,
    resetImages,
    fetchActive,
  } = useStore()

  const handleCanvasResize = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }
  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      resetImages()
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  useEffect(() => {
    if (!marimo || !marimo.size) return
    const newSize = remToPx(marimo.size, canvasWidth)
    setMarimoSizePx(newSize)
  }, [marimo?.size, canvasWidth])

  const animateMarimo = () => {
    if (marimo?.status === "dead") {
      setBounce(0) 
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
    if (!isDragging) {
      const animationFrameId = requestAnimationFrame(animateMarimo)
      return () => cancelAnimationFrame(animationFrameId)
    }
  }, [isDragging, bounce, velocity])

  useEffect(() => {
    updateMarimoStatusAndImgSrc()
  }, [trashItems?.length])

  useEffect(() => {
    if (!marimo) return
    fetchMarimoStatus()
  }, [marimo?.status])

  const loadMarimoImage = () => {
    if (!marimoImgSrc) return

    const marimoImage = imageRef.current
    marimoImage.src = marimoImgSrc
    marimoImage.onload = () => setMarimoImageLoaded(true)
    marimoImage.onerror = () => console.error("Failed to load image")
  }
  useEffect(() => {
    loadMarimoImage()
  }, [marimoImgSrc])

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
    const fetchMarimo = async () => {
      try {
        const response = await fetch(`/api/marimo/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()

        const marimoImageResponse = await fetch(
          `/api/marimo/images/${data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!marimoImageResponse.ok) {
          throw new Error("Failed to marimoImageResponse fetch data")
        }

        const images = await marimoImageResponse.json()

        if (images) {
          const { angry, dead, leftTwerk, rightTwerk } = images
          setImages(angry, dead, leftTwerk, rightTwerk)
        }

        setMarimo(data)

        setTrashItems(data.objects)

        updateMarimoStatusAndImgSrc()
        fetchMarimoStatus()
      } catch (error) {
        console.error("API Error:", error)
      }
    }

    fetchMarimo()
  }, [])

  useEffect(() => {
    if (marimo && marimo.rect) {
      const rectObject = JSON.parse(marimo.rect)
      const percentagedX = (canvasWidth * rectObject.x) / 100
      const percentagedY = (canvasHeight * rectObject.y) / 100
      setMarimoPosition({ x: percentagedX, y: percentagedY })
    }
  }, [marimo])

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

  const updateMarimo = async () => {
    if (!marimoPosition) return

    await fetchActive()

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
    console.log(updatedData)

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

  const handleDragEnd = () => {
    setIsDragging(false)
    updateMarimo()
  }

  return (
    <div>
      {isLoading && <Loading />}
      {marimo?.status === "dead" && (
        <div className={styles.button__div}>
          <button
            onClick={async (event) => {
              event.preventDefault()

              setIsLoading(true)
              await adoptMarimo()
              setIsLoading(false)
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
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      />
    </div>
  )
}

const DynamicCanvas = dynamic(() => Promise.resolve(Canvas), {
  ssr: false,
})

export default DynamicCanvas
