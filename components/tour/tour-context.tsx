"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { TOUR_STEPS, TourStep } from "./tour-config"

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

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenTour = localStorage.getItem("ledger_has_seen_tour")
    
    // Auto-start for first time users
    if (!hasSeenTour) {
      // Slight delay to allow UI to settle before starting tour
      const timer = setTimeout(() => {
        setIsActive(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const currentStep = isActive && currentStepIndex < TOUR_STEPS.length 
    ? TOUR_STEPS[currentStepIndex] 
    : null

  // Handle onEnter and onLeave triggers
  useEffect(() => {
    if (isActive && currentStep?.onEnter) {
      currentStep.onEnter()
    }
    return () => {
      if (isActive && currentStep?.onLeave) {
        currentStep.onLeave()
      }
    }
  }, [isActive, currentStepIndex, currentStep])

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

  if (!isMounted) return <>{children}</>

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
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
