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

    const updateSpotlight = () => {
      if (currentStep.targetSelector === "body" || currentStep.placement === "center") {
        setTargetRect(null)
        return
      }

      const el = document.querySelector(currentStep.targetSelector) as HTMLElement
      if (el) {
        // Scroll into view if needed
        const rect = el.getBoundingClientRect()
        const isOutViewport = 
          rect.top < 0 || 
          rect.left < 0 || 
          rect.bottom > (window.innerHeight || document.documentElement.clientHeight) || 
          rect.right > (window.innerWidth || document.documentElement.clientWidth)

        if (isOutViewport) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }

        // Get computed style for border radius
        const style = window.getComputedStyle(el)
        const radius = parseInt(style.borderRadius) || 0

        // After scrolling, recalculate the bounding rect
        setTimeout(() => {
          const newRect = el.getBoundingClientRect()
          setTargetRect({
            top: newRect.top,
            left: newRect.left,
            width: newRect.width,
            height: newRect.height,
            borderRadius: radius
          })
        }, 100) // Slight delay to wait for scrolling to begin settling
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
          setTargetRect(prev => prev ? { ...prev, top: rect.top, left: rect.left } : null)
        }
      }
    }

    window.addEventListener("resize", handleUpdate)
    window.addEventListener("scroll", handleUpdate)

    return () => {
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
  // This allows clicks to pass through to the element below if we wanted (pointer-events-none)
  // But we want to intercept clicks to prevent user interaction during the tour, so pointer-events-auto
  return (
    <div className="fixed inset-0 z-[90] pointer-events-auto">
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
