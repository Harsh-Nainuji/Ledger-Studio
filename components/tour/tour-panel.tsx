"use client"

import React, { useEffect, useState } from "react"
import { useTour } from "./tour-context"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

export function TourPanel() {
  const { isActive, currentStep, currentStepIndex, nextStep, prevStep, skipTour } = useTour()
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 })
  const totalSteps = 10 // Based on our config

  useEffect(() => {
    if (!isActive || !currentStep) return

    const updatePosition = () => {
      if (currentStep.targetSelector === "body" || currentStep.placement === "center") {
        // Center position
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          opacity: 1
        })
        return
      }

      const el = document.querySelector(currentStep.targetSelector)
      if (el) {
        const rect = el.getBoundingClientRect()
        const panelWidth = 320 // approximate width
        const panelHeight = 200 // approximate height
        const gap = 16

        let top = rect.top + rect.height / 2
        let left = rect.left + rect.width / 2

        switch (currentStep.placement) {
          case "top":
            top = rect.top - gap - panelHeight / 2
            left = rect.left + rect.width / 2
            break
          case "bottom":
            top = rect.bottom + gap + panelHeight / 2
            left = rect.left + rect.width / 2
            break
          case "left":
            top = rect.top + rect.height / 2
            left = rect.left - gap - panelWidth / 2
            break
          case "right":
            top = rect.top + rect.height / 2
            left = rect.right + gap + panelWidth / 2
            break
        }

        // Boundary checks to keep it on screen
        const padding = 16
        if (left < panelWidth / 2 + padding) left = panelWidth / 2 + padding
        if (left > window.innerWidth - panelWidth / 2 - padding) left = window.innerWidth - panelWidth / 2 - padding
        if (top < panelHeight / 2 + padding) top = panelHeight / 2 + padding
        if (top > window.innerHeight - panelHeight / 2 - padding) top = window.innerHeight - panelHeight / 2 - padding

        setPosition({ top, left, opacity: 1 })
      } else {
        // Fallback to center if element not found yet
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          opacity: 1
        })
      }
    }

    // Initial positioning
    updatePosition()

    // Smooth transition
    const timer = setTimeout(updatePosition, 300) // wait for scroll
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [isActive, currentStep])

  if (!isActive || !currentStep) return null

  return (
    <div
      className="fixed z-[100] transition-all duration-500 ease-in-out w-full max-w-[320px]"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
        opacity: position.opacity,
        pointerEvents: "auto",
      }}
    >
      <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Tour • Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <button 
            onClick={skipTour}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-sm hover:bg-slate-100 p-0.5"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-medium text-slate-900 mb-2">
            {currentStep.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {currentStep.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center justify-center h-8 w-8 rounded transition-colors ${
              currentStepIndex === 0 
                ? "text-slate-300 cursor-not-allowed" 
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center justify-center gap-1.5 h-8 px-4 bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded shadow-sm text-xs font-mono tracking-wide uppercase font-semibold"
          >
            {currentStep.actionLabel || "Next"}
            {!currentStep.actionLabel && <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
