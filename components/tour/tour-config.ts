import { ReactNode } from "react"
import { ViewMode } from "../navigation/navbar"

export type TourPlacement = "top" | "bottom" | "left" | "right" | "center"

export interface TourStep {
  id: string
  targetSelector: string
  title: string
  content: ReactNode | string
  placement: TourPlacement
  actionLabel?: string
  view?: ViewMode
  onEnter?: () => void
  onLeave?: () => void
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "intro",
    targetSelector: "body",
    view: "dashboard",
    title: "Welcome to Ledger Studio",
    content: "The intelligent operating system for freelancers. Let's take a guided tour across every workspace view.",
    placement: "center",
    actionLabel: "Start Tour",
  },
  {
    id: "navigation",
    targetSelector: "[data-tour='navbar-views']",
    view: "dashboard",
    title: "Master Navigation Bar",
    content: "Easily switch between your Dashboard, Quotes, Active Projects, Deal Lab intelligence, Playbook, and Economics Profile.",
    placement: "bottom",
  },
  {
    id: "dashboard-overview",
    targetSelector: "[data-tour='dashboard-metrics']",
    view: "dashboard",
    title: "Freelance Command Center",
    content: "Your Dashboard gives you an executive summary of active quote totals, effective hourly rates, and proposal diagnostics.",
    placement: "bottom",
  },
  {
    id: "quote-client",
    targetSelector: "[data-tour='client-section']",
    view: "quotes",
    title: "Client & Proposal Metadata",
    content: "Define client details, addresses, and proposal dates. This metadata automatically populates your styled proposal document.",
    placement: "right",
  },
  {
    id: "quote-services",
    targetSelector: "[data-tour='services-section']",
    view: "quotes",
    title: "Services & Deliverables",
    content: "Add line items, quantities, and rates. Ledger Studio tracks your effective hourly rate against your survival expense baseline.",
    placement: "right",
  },
  {
    id: "quote-scope",
    targetSelector: "[data-tour='scope-section']",
    view: "quotes",
    title: "Scope & Margin Protection",
    content: "Protect yourself from scope creep by explicitly defining included vs. excluded work, payment schedules, and revision limits.",
    placement: "right",
  },
  {
    id: "live-preview",
    targetSelector: "[data-tour='preview-section']",
    view: "quotes",
    title: "Live Editorial PDF Preview",
    content: "Watch your proposal build in real-time with high-end editorial typography and grid layout, ready for instant PDF export.",
    placement: "left",
  },
  {
    id: "projects",
    targetSelector: "[data-tour='projects-view']",
    view: "projects",
    title: "Active Projects Workspace",
    content: "Track ongoing client projects, contract values, due dates, and delivery statuses in one organized hub.",
    placement: "center",
  },
  {
    id: "deal-lab",
    targetSelector: "[data-tour='deal-lab-hub']",
    view: "deal-lab",
    title: "Deal Intelligence Lab",
    content: "Run proposal X-Rays, simulate scope creep scenarios, and use the Hidden Work Detector to catch unbillable hours before sending quotes.",
    placement: "center",
  },
  {
    id: "playbook",
    targetSelector: "[data-tour='playbook-view']",
    view: "playbook",
    title: "Services & Terms Playbook",
    content: "Save reusable service presets, default payment terms, and scope templates so you never start from scratch.",
    placement: "center",
  },
  {
    id: "profile",
    targetSelector: "[data-tour='profile-view']",
    view: "profile",
    title: "Freelancer Profile & Economics",
    content: "Set your monthly survival expenses and target working hours to ensure every proposal meets your minimum baseline hourly rate.",
    placement: "center",
  },
  {
    id: "finish",
    targetSelector: "body",
    view: "dashboard",
    title: "You're All Set!",
    content: "You've explored all of Ledger Studio. Send better proposals, protect your margins, and eliminate scope creep.",
    placement: "center",
    actionLabel: "Finish Tour",
  }
]
