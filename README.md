# Ledger Studio

> A freelance workspace for creating quotes, understanding pricing, and protecting project scope.

**Live Demo:** [Add your live demo URL here]

Ledger Studio started with a simple question:

**Is the price of my freelance project actually sustainable for me?**

Most quote builders are good at calculating:

```text
Quantity × Rate = Price
```

But that only tells you what the client is paying.

Ledger Studio tries to make the freelancer side of the deal easier to understand too.

---

## What is Ledger Studio?

Ledger Studio is a browser-based freelance workspace for:

* Creating professional quotes
* Checking the economics of a deal
* Finding work that may have been missed from the quote
* Reviewing proposal risks
* Testing scope-creep situations
* Managing active projects

The goal is not to tell freelancers what they *should* charge.

The goal is to make the information behind a quote easier to see.

---

## Freelancer Baseline

Ledger Studio has a **Freelancer Baseline** that lets you enter:

* Monthly survival expenses
* Desired working hours per month

From this, the app calculates a personal **minimum hourly rate**.

This is not a market-rate calculator.

It does not use an external database to tell you what your rate should be.

It is simply a personal financial floor.

If a quote falls below that floor, Ledger Studio can flag it.

---

## Hidden Work Detector

Freelance projects often contain work that doesn't appear clearly in the original quote.

For example:

```text
Build website — 40 hours
```

The actual project may also involve:

* Testing
* Deployment
* Configuration
* Analytics setup
* SEO work
* Revisions
* Other supporting tasks

Ledger Studio has a **Hidden Work Detector** that checks the quote description, scope of work, and terms against predefined rules and keywords.

When something is detected, you can:

* Add it to the scope
* Mark it as an internal task
* Ignore it

### Important limitation

The detector is **rule-based**.

It is not an AI system that understands every possible hidden task.

Because of that, it can miss things or flag something that is not relevant.

---

## Proposal X-Ray

The **Proposal X-Ray** performs a pre-flight check of a proposal across areas such as:

* Scope clarity
* Revision protection
* Payment terms
* Timeline
* Client responsibilities
* Supporting work
* Pricing health

It produces a proposal health score and points to sections that may need attention.

---

## Scope Creep Simulator

The **Scope Creep Simulator** lets you test how a project can change when a client asks for additional work.

The simulation can change:

* Scope
* Estimated workload
* Price
* Effective economics

You can respond by:

* Accepting the change
* Charging extra
* Swapping existing scope
* Protecting the original scope

It is a simple way to think through scope decisions before dealing with them on a real project.

---

## Quotes & Pricing

The quote builder supports:

* Freelancer / company information
* Client information
* Quote metadata
* Dynamic line items
* Quantities
* Hourly or unit rates
* Tax
* Discounts
* Multiple currencies
* Payment milestones
* Scope of work
* Terms and revision policies

The application calculates line-item totals, subtotal, tax, discount, grand total, and effective hourly rate.

Payment milestones are validated so that they add up to exactly **100%** before export.

---

## PDF Export

Quotes can be previewed in real time and exported as PDF directly from the browser.

The PDF is generated on the client side using `@react-pdf/renderer`.

---

## Active Projects

Accepted quotes can be converted into active projects.

Projects can track:

* Client
* Contract value
* Start date
* Due date
* Current status

Available statuses:

```text
In Progress
Awaiting Client
Completed
Canceled
```

---

## Privacy

Ledger Studio is designed to work locally in the browser.

The core workflow does not require:

* Login
* An account
* A backend database
* Cloud storage
* User tracking

Quote data, freelancer settings, sender information, and projects are stored in browser `localStorage`.

---

## Tech Stack

* Next.js 16
* React 19
* Tailwind CSS v4
* Lucide React
* GSAP
* `@react-pdf/renderer`
* Browser `localStorage`

---

# Run Locally

## Requirements

Make sure you have Node.js and npm installed.

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

Open:

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

The main application is organized around the freelance workflow:

```text
app/
components/
views/
deal-lab/
lib/
```

Some of the main logic lives in:

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

---

# Limitations

Ledger Studio is intentionally not trying to solve every freelancing problem.

### Freelancer Baseline

A personal minimum rate does not tell you what a specific client or market will actually pay.

### Hidden Work Detector

The detector relies on predefined rules and keywords, so it can miss relevant work or flag irrelevant work.

### Proposal Analysis

A proposal can still be a bad deal even when the numbers look good.

These tools are meant to make potential problems easier to notice, not make the decision for the freelancer.

---

# Why I Built It

I built Ledger Studio because I wanted freelance proposals to answer more than:

> "How much does this project cost?"

I also wanted them to make it easier to answer:

> "What does this deal actually mean for me?"

A lot of the system is intentionally deterministic.

Instead of having a model invent a price or tell the freelancer what they should charge, Ledger Studio uses information the freelancer already knows and makes the economics, workload, and proposal risks easier to see.

---

## If You Find It Useful

If you try Ledger Studio and find it useful:

⭐ **Star the repository**

And if you build something with it, I'd appreciate a mention.

Feedback, issues, and suggestions are also welcome.

---

## Author

**Harsh Nainuji**

GitHub: [Harsh-Nainuji](https://github.com/Harsh-Nainuji)

LinkedIn: [Harsh Nainuji](https://www.linkedin.com/in/harsh-coding/)

Website: [Atarico](https://www.atarico.dev)
