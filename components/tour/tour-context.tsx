"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { TOUR_STEPS, TourStep } from "./tour-config"
import { ViewMode } from "../navigation/navbar"

interface TourContextType {
  isActive: boolean
  currentStepIndex: number
  currentStep: TourStep | null
  startTour: () => void
  endTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ 
  children, 
  onNavigate 
}: { 
  children: ReactNode
  onNavigate?: (view: ViewMode) => void 
}) {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenWelcome = localStorage.getItem("ledger-studio-welcome-seen")
    const hasSeenTour = localStorage.getItem("ledger_has_seen_tour")
    
    // Auto-start ONLY if welcome screen was already seen in a prior session
    if (hasSeenWelcome && !hasSeenTour) {
      const timer = setTimeout(() => {
        setIsActive(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const currentStep = isActive && currentStepIndex < TOUR_STEPS.length 
    ? TOUR_STEPS[currentStepIndex] 
    : null

  // Handle page navigation, onEnter, and onLeave triggers
  useEffect(() => {
    if (isActive && currentStep) {
      if (currentStep.view && onNavigate) {
        onNavigate(currentStep.view)
      }
      if (currentStep.onEnter) {
        currentStep.onEnter()
      }
    }
    return () => {
      if (isActive && currentStep?.onLeave) {
        currentStep.onLeave()
      }
    }
  }, [isActive, currentStepIndex, currentStep, onNavigate])

  const startTour = () => {
    setCurrentStepIndex(0)
    setIsActive(true)
  }

  const endTour = () => {
    setIsActive(false)
    localStorage.setItem("ledger_has_seen_tour", "true")
  }

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      endTour()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const skipTour = () => {
    endTour()
  }

  // Prevent scrolling when tour is active (we handle scroll manually)
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isActive])

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    return {
      isActive: false,
      currentStepIndex: 0,
      currentStep: null,
      startTour: () => {},
      endTour: () => {},
      nextStep: () => {},
      prevStep: () => {},
      skipTour: () => {},
    }
  }
  return context
}
