"use client"

import React, { useEffect, useState } from "react"
import { useTour } from "./tour-context"

export function SpotlightOverlay() {
  const { isActive, currentStep } = useTour()
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number; borderRadius: number } | null>(null)

  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetRect(null)
      return
    }

    let timer: ReturnType<typeof setTimeout>
    let scrollTimer: ReturnType<typeof setTimeout>
    let attempts = 0

    const updateSpotlight = () => {
      if (currentStep.targetSelector === "body" || currentStep.placement === "center") {
        setTargetRect(null)
        return
      }

      const el = document.querySelector(currentStep.targetSelector) as HTMLElement
      if (el) {
        // Scroll into view
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })

        const style = window.getComputedStyle(el)
        const radius = parseInt(style.borderRadius) || 0

        const rect = el.getBoundingClientRect()
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: radius
        })

        // Recalculate after scrolling settles
        scrollTimer = setTimeout(() => {
          const newRect = el.getBoundingClientRect()
          setTargetRect({
            top: newRect.top,
            left: newRect.left,
            width: newRect.width,
            height: newRect.height,
            borderRadius: radius
          })
        }, 250)
      } else if (attempts < 15) {
        attempts++
        timer = setTimeout(updateSpotlight, 100)
      } else {
        setTargetRect(null)
      }
    }

    updateSpotlight()

    // Handle resize and scroll updates
    const handleUpdate = () => {
      if (currentStep.targetSelector !== "body") {
        const el = document.querySelector(currentStep.targetSelector)
        if (el) {
          const rect = el.getBoundingClientRect()
          setTargetRect(prev => prev ? { ...prev, top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null)
        }
      }
    }

    window.addEventListener("resize", handleUpdate)
    window.addEventListener("scroll", handleUpdate)

    return () => {
      clearTimeout(timer)
      clearTimeout(scrollTimer)
      window.removeEventListener("resize", handleUpdate)
      window.removeEventListener("scroll", handleUpdate)
    }
  }, [isActive, currentStep])

  if (!isActive) return null

  // If no specific target, just render a full dark overlay
  if (!targetRect) {
    return (
      <div className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-[2px] transition-all duration-500 animate-in fade-in pointer-events-none" />
    )
  }

  // Draw an SVG mask to create a "hole" in the overlay
  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0 transition-all duration-500">
        <defs>
          <mask id="spotlight-mask">
            {/* White covers the entire screen, allowing the overlay to show */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black cuts a hole in the mask */}
            <rect
              x={targetRect.left - 8} // 8px padding
              y={targetRect.top - 8}
              width={targetRect.width + 16}
              height={targetRect.height + 16}
              rx={targetRect.borderRadius + 4}
              ry={targetRect.borderRadius + 4}
              fill="black"
              className="transition-all duration-500 ease-in-out"
            />
          </mask>
        </defs>
        
        {/* The semi-transparent overlay */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.4)" // slate-900/40
          mask="url(#spotlight-mask)"
          className="transition-all duration-500 backdrop-blur-sm"
        />
        
        {/* The highlight border */}
        <rect
          x={targetRect.left - 8}
          y={targetRect.top - 8}
          width={targetRect.width + 16}
          height={targetRect.height + 16}
          rx={targetRect.borderRadius + 4}
          ry={targetRect.borderRadius + 4}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
    </div>
  )
}
