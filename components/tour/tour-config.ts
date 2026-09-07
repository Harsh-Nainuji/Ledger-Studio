import { ReactNode } from "react"

export type TourPlacement = "top" | "bottom" | "left" | "right" | "center"

export interface TourStep {
  id: string
  targetSelector: string
  title: string
  content: ReactNode | string
  placement: TourPlacement
  actionLabel?: string
  onEnter?: () => void
  onLeave?: () => void
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "intro",
    targetSelector: "body",
    title: "Welcome to Ledger Studio",
    content: "The intelligent operating system for freelancers. Let's take a quick tour to see how to protect your margins and scope.",
    placement: "center",
    actionLabel: "Start Tour",
  },
  {
    id: "navigation",
    targetSelector: "[data-tour='navbar-views']",
    title: "The Editorial Workspace",
    content: "Everything you need is organized into distinct views: Dashboard, Quotes, active Projects, Deal Lab intelligence, and your Playbook.",
    placement: "bottom",
  },
  {
    id: "quote-client",
    targetSelector: "[data-tour='client-section']",
    title: "Client & Project Details",
    content: "Start by defining who the quote is for. This metadata automatically populates the final proposal document.",
    placement: "right",
  },
  {
    id: "quote-services",
    targetSelector: "[data-tour='services-section']",
    title: "Services & Deliverables",
    content: "Add line items for the work you're doing. You can pull these directly from your Playbook to save time.",
    placement: "right",
  },
  {
    id: "quote-payment",
    targetSelector: "[data-tour='payment-section']",
    title: "Payment Terms",
    content: "Define your milestone schedule (e.g., 50% upfront, 50% on delivery) to ensure healthy cash flow.",
    placement: "right",
  },
  {
    id: "quote-scope",
    targetSelector: "[data-tour='scope-section']",
    title: "Scope & Revisions",
    content: "Protect yourself from scope creep by explicitly defining what is included, what is excluded, and your revision policy.",
    placement: "right",
  },
  {
    id: "live-preview",
    targetSelector: "[data-tour='preview-section']",
    title: "Live Editorial Preview",
    content: "Watch your proposal build in real-time. The design is engineered to look premium, editorial, and trustworthy to clients.",
    placement: "left",
  },
  {
    id: "contextual-bar",
    targetSelector: "[data-tour='intelligence-bar']",
    title: "Deal Intelligence",
    content: "Before sending the quote, the Contextual Bar warns you of potential risks, missing clauses, or hidden work.",
    placement: "top",
  },
  {
    id: "deal-lab",
    targetSelector: "[data-tour='deal-lab']",
    title: "The Deal Lab",
    content: "Run your proposal through the X-Ray, simulate Scope Creep scenarios, and use the Hidden Work Detector to find unbillable hours.",
    placement: "left",
  },
  {
    id: "finish",
    targetSelector: "body",
    title: "You're ready to go",
    content: "Send better proposals, set clear boundaries, and protect your margins. Welcome to Ledger Studio.",
    placement: "center",
    actionLabel: "Finish Tour",
  }
]
