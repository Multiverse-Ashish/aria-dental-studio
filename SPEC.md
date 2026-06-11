# System Specification (SPEC.md) - Premium Tools Portal

## 1. Project Goal
Develop a visually stunning, high-fidelity, responsive tools catalog landing page with matching legal pages. All assets use pure HTML, CSS, and JS (vanilla) to achieve premium dark obsidian aesthetics, micro-animations, and seamless interactions.

---

## 2. Design System & Style Guide
- **Core Theme**: Obsidian minimalist dark mode.
- **Font Face**:
  - Headings: `Outfit` (sans-serif)
  - Body: `Inter` (sans-serif)
- **Palette**:
  - Background: `#09090b` (Deep Slate Obsidian)
  - Card Fill: `rgba(20, 20, 23, 0.6)`
  - Card Border: `1px solid rgba(255, 255, 255, 0.08)`
  - Text Primary: `#f4f4f5` (Bright Off-White)
  - Text Secondary: `#a1a1aa` (Cool Gray)
  - Accent Color: `#6366f1` to `#a855f7` (Indigo-Violet gradient)
- **Transitions**: Smooth HSL transformations, hover scale effects, and glass backdrop blurs (`backdrop-filter: blur(12px)`).
- **Theme Controls**: Global light/dark theme toggle storing user preference in `localStorage`. Automatically styles all headers, cards, footers, and legal prose.

---

## 3. Page Requirements

### A. Main Landing Page (`index.html`)
1. **Sticky Glass Header**:
   - Title/Logo: "ApexTools" or "ToolSuite" (custom gradient logo).
   - Navigation links: Home, Tools, Pricing, FAQs (which scroll smoothly).
   - Header button: CTA "All-Access Pass" which triggers the checkout modal.
   - **Theme Toggle Button**: Visually matches the dark/light mode states.
2. **Hero Section**:
   - Gradient badge: "⚡ All Tools Included"
   - Main H1 tag: "Supercharge Your Workflow With Premium Micro-Tools."
   - Description: A clean descriptor detailing that it is an all-in-one suite.
   - Core Action Button (CTA): "Get All-Access Pass".
   - Stats display: e.g. "20+ Tools coming", "100k+ Runs", "99.9% Uptime".
3. **Tools Grid**:
   - Search bar with instant filter logic.
   - Horizontal category tags (e.g., "All", "Developer", "Design", "Content").
   - 8 active premium tools linking to clean local HTML files.
4. **Pricing Section**:
   - Single-tier plan: **$99/year**.
   - Benefits checklist (e.g., Unlimited usage, No rate limits, Early access, Premium support).
   - Checkout button.
5. **Footer**:
   - Brand description.
   - Navigation & Tool categorisation anchors.
   - Legal Section containing links to the policy pages: Privacy Policy, Terms of Service, Refund Policy, Cookie Policy.

### B. Legal & Policy Pages
All legal pages should utilize the same style framework (`styles.css`), maintaining a premium reading design and executing the theme manager.
- **Privacy Policy** (`privacy.html`)
- **Terms of Service** (`terms.html`)
- **Refund Policy** (`refund.html`)
- **Cookie Policy** (`cookies.html`)

---

## 4. Full-Stack & Payment Integration
- **Server** (`server.js`): A Node.js/Express server that serves all static assets, compiles JSX tools, and exposes the webhook receiver.
- **Dodo Payments Webhook** (`/api/webhook`):
  - Listens for Dodo Payments events (`payment.succeeded`, `subscription.created`, `subscription.cancelled`).
  - Verifies payloads using HMAC SHA-256 signature verification.
  - Configures user states based on active memberships.
- **Babel & Lucide React**: Loads tools dynamically, implementing robust fallback handlers for third-party CDNs.

