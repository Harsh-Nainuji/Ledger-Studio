# Ledger Studio

> A privacy-first freelance workspace for creating quotes, understanding deal economics, and protecting project scope.

**Live Demo:** [Add your deployed URL here]

Ledger Studio started from a simple problem:

Most freelance quote builders are good at calculating:

```text
quantity × rate = price
```

But that doesn't necessarily tell you whether the deal makes sense for the freelancer.

Ledger Studio is built around the idea that a proposal should be evaluated from both sides:

**What does the client pay, and what does the deal actually mean for the freelancer?**

---

## What It Does

Ledger Studio combines proposal creation with tools that help freelancers examine the economics and risks behind a deal.

### Freelancer Baseline

Enter:

* Monthly survival expenses
* Desired working hours per month

Ledger Studio calculates a personal **minimum hourly rate**.

This is not a market-rate recommendation.

It is simply a personal financial floor based on the information provided by the freelancer.

If a proposal falls below that floor, Ledger Studio can flag it.

---

### Hidden Work Detector

Freelance projects often contain work that isn't explicitly included in the quote.

For example:

```text
Build website — 40 hours
```

The actual project might also require:

* Testing
* Deployment
* Configuration
* Analytics setup
* SEO-related work
* Revision work

Ledger Studio scans the quote description, scope of work, and terms using predefined rules and keywords.

If supporting work is detected, the freelancer can:

* **Add to Scope**
* **Internal Task**
* **Ignore**

The detector is intentionally rule-based.

It is **not an AI system that understands every possible hidden task**, so it can miss things or produce irrelevant matches.

---

## Proposal X-Ray

The Proposal X-Ray performs a pre-flight check of a proposal across several areas, including:

* Scope clarity
* Revision protection
* Payment terms
* Timeline
* Client responsibilities
* Supporting work
* Pricing health

It produces a health score and identifies areas that may need attention.

---

## Scope Creep Simulator

The Scope Creep Simulator lets freelancers test how they might respond when a client asks for additional work.

Scenarios can change:

* Project scope
* Workload
* Price
* Minimum rate

The freelancer can choose responses such as:

* Accept
* Charge Extra
* Swap Scope
* Protect Scope

The goal isn't to predict how a real client will behave.

It's a small simulation for thinking through scope decisions before they happen.

---

## Quotes & Pricing

Ledger Studio includes a complete quote builder with:

* Freelancer / company information
* Client information
* Document metadata
* Dynamic line items
* Quantities
* Hourly or unit rates
* Tax
* Discounts
* Multiple currencies
* Payment milestones
* Scope of work
* Terms and revision policies

Line items, tax, discounts, totals, and milestone validation are calculated directly by the application. Payment milestones must total exactly **100%** before export.

---

## Effective Hourly Rate

Ledger Studio calculates the effective hourly rate of a proposal so the freelancer can see the relationship between:

```text
Project price
     ↓
Estimated workload
     ↓
Effective hourly rate
```

This can then be compared with the freelancer's personal baseline.

The purpose is not to determine what someone *should* charge.

It is to make the economics of an existing quote easier to see.

---

## Proposal PDF

Quotes can be previewed in real time and exported as PDF directly from the browser.

PDF generation uses `@react-pdf/renderer`.

No external PDF service is required.

---

## Active Projects

Accepted quotes can be converted into active projects.

Projects can track:

* Client
* Contract value
* Start date
* Due date
* Project status

Available statuses include:

```text
In Progress
Awaiting Client
Completed
Canceled
```

Projects support the currency selected in the original quote.

---

## Privacy & Architecture

Ledger Studio is designed to work locally in the browser.

The core application does **not require**:

* An account
* Login
* A backend database
* Cloud storage
* User tracking

Quote data, freelancer settings, sender information, and projects are persisted using browser `localStorage`.

This means the repository can be run locally without setting up a database or backend service.

---

## Tech Stack

* **Next.js 16**
* **React 19**
* **Tailwind CSS v4**
* **Lucide React**
* **GSAP**
* **@react-pdf/renderer**
* Browser `localStorage`

## The application uses the Next.js App Router and React state hooks for its core state management.

# Run Locally

## Requirements

Make sure you have:

* Node.js
* npm

installed on your machine.

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd YOUR_REPOSITORY
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Build for Production

```bash
npm run build
```

Then:

```bash
npm start
```

---

# Project Structure

The project is organized around the main freelance workflow:

```text
app/
components/
views/
deal-lab/
lib/
```

Some of the core logic lives in:

```text
lib/
├── quote-utils.ts
├── formatCurrency.ts
├── project-utils.ts
├── hidden-work-rules.ts
├── xray-engine.ts
├── scope-creep-scenarios.ts
└── deal-gamification.ts
```

The quote calculation utilities handle subtotals, taxes, discounts, quote numbers, and payment milestone validation.

The Deal Intelligence modules handle hidden-work detection, proposal analysis, scope-creep scenarios, and the XP/achievement system.

---

# Limitations

Ledger Studio is intentionally not trying to solve every problem in freelancing.

### The Freelancer Baseline is not a market-rate calculator

A rate based on personal expenses does not tell you what a particular client or market will pay.

### Hidden Work Detector is not AI

It uses predefined rules and keywords.

That means it can:

* Miss relevant work
* Flag irrelevant work
* Depend heavily on how the scope is written

### Proposal health is not a guarantee

A proposal can score well and still become a bad deal.

Likewise, a proposal can have warnings and still be perfectly reasonable depending on the situation.

The tools are intended to expose things worth reviewing, not make the decision for the freelancer.

---

# Roadmap

Planned improvements include:

* Invoice generation from active projects
* Expanded scope preset library
* Additional offline PDF template styles

These are future ideas rather than guarantees of upcoming releases.

---

# Why I Built This

I built Ledger Studio because I wanted freelance proposals to answer more than:

> "How much does this project cost?"

I wanted them to also make it easier to answer:

> "What does this deal actually mean for me?"

The project is intentionally deterministic in the areas where simple calculations are enough.

Instead of trying to make an AI decide what a freelancer should charge, Ledger Studio uses the information the freelancer already knows and makes the economics, workload, and potential risks more visible.

---

# License

Add your chosen license here.

If you want people to freely use, modify, and redistribute the project, consider adding an open-source license such as MIT.

Without a license, publicly visible source code is **not automatically free for others to reuse**.

---

## Screenshots / Demo

Add screenshots or a short demo video here.

Recommended:

1. Dashboard
2. Quote builder
3. Freelancer Baseline
4. Hidden Work Detector
5. Proposal X-Ray
6. Scope Creep Simulator

---

## Author

**Harsh N**

* GitHub: https://github.com/Harsh-Nainuji
* LinkedIn: https://www.linkedin.com/in/harshnainuji/
* Website: https://www.atarico.dev
