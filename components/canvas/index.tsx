"use client"

import dynamic from "next/dynamic"

import React, { useState, useEffect, useRef } from "react"

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

  const [marimoPosition, setMarimoPosition] = useState({
    x: -500, // fetch 전 안보이게 하려고 넣어놓은 숫자
    y: -500,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(new Image())
  const [bounce, setBounce] = useState(0)
  const [velocity, setVelocity] = useState(0.5)
  const { user, marimo, setMarimo, trashItems, closeActive } = useStore()
  const [marimoSize, setMarimoSize] = useState(5) // 5rem

  const marimoImgSrc = marimo?.src ?? "/images/marimo.svg"

  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [])

  const handleCanvasResize = () => {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }

  const animateMarimo = () => {
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

  const loadMarimoImage = () => {
    const marimoImage = imageRef.current
    marimoImage.src = marimoImgSrc
    marimoImage.onload = () => setMarimoImageLoaded(true)
    marimoImage.onerror = () => console.error("Failed to load image")
  }
  const loadTrashImages = () => {
    if (!trashItems) return
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

  useEffect(() => {
    console.log("로드된 쓰레기 이미지 객체는", loadedTrashImages)
  }, [loadedTrashImages])
  const drawOnCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        if (marimoImageLoaded && marimo) {
          const pxSize = remToPx(marimoSize, canvasWidth)

          ctx.drawImage(
            imageRef.current,
            marimoPosition.x,
            marimoPosition.y + bounce,
            pxSize,
            pxSize,
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
          if (trash.isActive) {
            if (isColliding(marimoPosition, { x, y, width: 50, height: 50 })) {
              trash.isActive = false
              closeActive(trash.id)
            } else {
              ctx.drawImage(trash.image, x, y, 50, 50)
            }
          }
        })
      }
    }
  }
  const isColliding = (
    marimoPosition: { x: number; y: number },
    trashPosition: { x: number; y: number; width: number; height: number },
  ) => {
    if (!marimo) return
    return !(
      marimoPosition.x + marimoSize < trashPosition.x ||
      marimoPosition.x > trashPosition.x + trashPosition.width ||
      marimoPosition.y + marimoSize < trashPosition.y ||
      marimoPosition.y > trashPosition.y + trashPosition.height
    )
  }
  useEffect(() => {
    drawOnCanvas()
  }, [
    marimoPosition,
    marimoImageLoaded,
    loadedTrashImages,
    canvasWidth,
    canvasHeight,
  ])

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !marimo) return

    const x = event.clientX - rect.left // 클릭한 x 좌표를 캔버스 상대 좌표로 변환
    const y = event.clientY - rect.top //클릭한 y 좌표를 캔버스 상대 좌표로 변환
    if (
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSize &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSize
    ) {
      setIsDragging(true)
      setStartPosition({ x: x - marimoPosition.x, y: y - marimoPosition.y }) // 드래그 시작 위치를 저장
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !marimo) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSize &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSize
    ) {
      canvas.style.cursor = "pointer"
    } else {
      canvas.style.cursor = "default"
    }

    // 드래그 상태일 때만 위치 업데이트
    if (isDragging) {
      const newX = Math.min(
        Math.max(0, x - startPosition.x),
        canvasWidth - marimoSize,
      )
      const newY = Math.min(
        Math.max(0, y - startPosition.y),
        canvasHeight - 200, //마리모 size + 100 (헤더 사이즈)
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()

      setMarimo({
        ...data.user,
      })
      console.log("marimo를 잘 데려왔습니다.", data.user)
    } catch (error) {
      console.error("API Error:", error)
    }
  }

  const updateMarimo = async () => {
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
    const x = touch.clientX - rect.left // 클릭한 x 좌표를 캔버스 상대 좌표로 변환
    const y = touch.clientY - rect.top // 클릭한 y 좌표를 캔버스 상대 좌표로 변환

    if (
      x > marimoPosition.x &&
      x < marimoPosition.x + marimoSize &&
      y > marimoPosition.y &&
      y < marimoPosition.y + marimoSize
    ) {
      setIsDragging(true)
      setStartPosition({ x: x - marimoPosition.x, y: y - marimoPosition.y }) // 드래그 시작 위치를 저장
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
      // 이벤트의 기본 동작을 막지 않고 업데이트 함수를 바로 호출합니다.
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
    if (marimo) {
      const rectObject = JSON.parse(marimo.rect)
      const percentagedX = (canvasWidth * rectObject.x) / 100
      const percentagedY = (canvasHeight * rectObject.y) / 100
      setMarimoPosition({ x: percentagedX, y: percentagedY })
    }
  }, [marimo])

  useEffect(() => {
    if (!marimo) return
    setMarimoSize(marimoSize)
  }, [marimo?.size])

  return (
    <div>
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
