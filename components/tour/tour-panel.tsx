'use client';

import React, { useEffect, useState } from "react"
import { useTour } from "./tour-context"
import { TOUR_STEPS } from "./tour-config"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

export function TourPanel() {
  const { isActive, currentStep, currentStepIndex, nextStep, prevStep, skipTour } = useTour()
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 })
  const totalSteps = TOUR_STEPS.length

  useEffect(() => {
    if (!isActive || !currentStep) return

    let timer: ReturnType<typeof setTimeout>
    let scrollTimer: ReturnType<typeof setTimeout>
    let attempts = 0

    const updatePosition = () => {
      if (currentStep.targetSelector === "body" || currentStep.placement === "center") {
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
        const panelWidth = 340
        const panelHeight = 220
        const gap = 20

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
        const padding = 20
        if (left < panelWidth / 2 + padding) left = panelWidth / 2 + padding
        if (left > window.innerWidth - panelWidth / 2 - padding) left = window.innerWidth - panelWidth / 2 - padding
        if (top < panelHeight / 2 + padding) top = panelHeight / 2 + padding
        if (top > window.innerHeight - panelHeight / 2 - padding) top = window.innerHeight - panelHeight / 2 - padding

        setPosition({ top, left, opacity: 1 })

        // Recalculate after scrolling settles
        scrollTimer = setTimeout(() => {
          const newRect = el.getBoundingClientRect()
          let newTop = newRect.top + newRect.height / 2
          let newLeft = newRect.left + newRect.width / 2

          switch (currentStep.placement) {
            case "top":
              newTop = newRect.top - gap - panelHeight / 2
              newLeft = newRect.left + newRect.width / 2
              break
            case "bottom":
              newTop = newRect.bottom + gap + panelHeight / 2
              newLeft = newRect.left + newRect.width / 2
              break
            case "left":
              newTop = newRect.top + newRect.height / 2
              newLeft = newRect.left - gap - panelWidth / 2
              break
            case "right":
              newTop = newRect.top + newRect.height / 2
              newLeft = newRect.right + gap + panelWidth / 2
              break
          }

          if (newLeft < panelWidth / 2 + padding) newLeft = panelWidth / 2 + padding
          if (newLeft > window.innerWidth - panelWidth / 2 - padding) newLeft = window.innerWidth - panelWidth / 2 - padding
          if (newTop < panelHeight / 2 + padding) newTop = panelHeight / 2 + padding
          if (newTop > window.innerHeight - panelHeight / 2 - padding) newTop = window.innerHeight - panelHeight / 2 - padding

          setPosition({ top: newTop, left: newLeft, opacity: 1 })
        }, 250)
      } else if (attempts < 15) {
        attempts++
        timer = setTimeout(updatePosition, 100)
      } else {
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          opacity: 1
        })
      }
    }

    updatePosition()

    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      clearTimeout(timer)
      clearTimeout(scrollTimer)
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
      <div className="bg-ledger-paper border-2 border-ledger-text shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-ledger-text/20 bg-ledger-warm/40">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey font-bold">
            Tour • Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <button 
            onClick={skipTour}
            className="text-ledger-grey hover:text-ledger-text transition-colors p-0.5"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <h3 className="font-serif text-xl font-bold text-ledger-text">
            {currentStep.title}
          </h3>
          <p className="font-serif text-sm text-ledger-grey leading-relaxed">
            {currentStep.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-ledger-warm/20 border-t border-ledger-text/20">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center justify-center h-8 w-8 border border-ledger-text transition-colors ${
              currentStepIndex === 0 
                ? "text-ledger-grey/40 border-ledger-text/30 cursor-not-allowed" 
                : "text-ledger-text hover:bg-ledger-warm bg-ledger-paper"
            }`}
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center justify-center gap-1.5 h-8 px-4 bg-ledger-text text-ledger-cream hover:bg-ledger-dark transition-colors text-[10px] font-mono tracking-[0.1em] uppercase border border-ledger-text font-bold"
          >
            {currentStep.actionLabel || "Next"}
            {!currentStep.actionLabel && <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
