"use client"

import { useEffect, useState, useRef } from "react"

interface CanvasDimensions {
  width: number
  height: number
  scale: number
  offsetX: number
  offsetY: number
}

export const useResponsiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 350,
    height: 700,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return

      const container = canvasRef.current.parentElement
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Base game dimensions
      const baseWidth = 350
      const baseHeight = 700
      const aspectRatio = baseWidth / baseHeight

      // Calculate optimal dimensions
      let canvasWidth = containerWidth
      let canvasHeight = containerWidth / aspectRatio

      // If height exceeds container, scale by height instead
      if (canvasHeight > containerHeight) {
        canvasHeight = containerHeight
        canvasWidth = containerHeight * aspectRatio
      }

      // Calculate scale factor
      const scale = Math.min(canvasWidth / baseWidth, canvasHeight / baseHeight)

      // Calculate centering offsets
      const offsetX = (containerWidth - canvasWidth) / 2
      const offsetY = (containerHeight - canvasHeight) / 2

      setDimensions({
        width: canvasWidth,
        height: canvasHeight,
        scale,
        offsetX,
        offsetY,
      })

      // Update canvas size
      canvasRef.current.style.width = `${canvasWidth}px`
      canvasRef.current.style.height = `${canvasHeight}px`
      canvasRef.current.style.marginLeft = `${offsetX}px`
      canvasRef.current.style.marginTop = `${offsetY}px`
    }

    // Initial size calculation
    updateCanvasSize()

    // Listen for resize events
    window.addEventListener("resize", updateCanvasSize)
    window.addEventListener("orientationchange", updateCanvasSize)

    // Listen for device pixel ratio changes
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mediaQuery.addListener(updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      window.removeEventListener("orientationchange", updateCanvasSize)
      mediaQuery.removeListener(updateCanvasSize)
    }
  }, [])

  // Convert screen coordinates to game coordinates
  const screenToGame = (screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }

    const gameX = (screenX - rect.left) / dimensions.scale
    const gameY = (screenY - rect.top) / dimensions.scale

    return { x: gameX, y: gameY }
  }

  return {
    canvasRef,
    dimensions,
    screenToGame,
  }
}
