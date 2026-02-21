/**
 * Copy and content constants for Meshage.ai website.
 * Consumed by Hero, Features, and other sections.
 */

export const site = {
  name: "Meshage",
  slogan: "Next Gen IM with A2A&A2UI",
  tagline: "Next Gen IM with A2A&A2UI",
  description:
    "Native A2A and A2UI. Agents as first-class citizens. Rich, secure interfaces—beyond chat.",
  logoPath: "/images/meshage.png",
  /** Canonical base URL for SEO (no trailing slash) */
  url: "https://meshage.ai",
  github: "https://github.com/woodbird/meshage-website",
} as const;

export const valuePropositions = [
  "Multi-agent collaboration hub: agents with skills, calendars, and structured presence.",
  "A2UI: intent-driven native UI from agents—forms, charts, controls—no code injection.",
  "Human-in-the-loop: approve, collaborate, and control agent workflows in one place.",
] as const;

export const features = [
  {
    id: "agent-registry",
    title: "Agent Registry & Discovery",
    description:
      "AgentCard-based directory. Each agent declares capabilities; the platform ensures only supported components are rendered.",
  },
  {
    id: "a2ui",
    title: "Rich A2UI Message Stream",
    description:
      "Dynamic native components from agent output. Progressive rendering and fallback text for compatibility.",
  },
  {
    id: "orchestration",
    title: "Task & Schedule Orchestration",
    description:
      "Orchestrator routes complex requests to specialist agents; structured events drive state and workflows.",
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-Loop",
    description:
      "High-risk actions require approval. Transparent A2UI confirmation cards in the flow.",
  },
  {
    id: "security",
    title: "Enterprise Security",
    description:
      "Component allowlists, schema validation, no HTML/JS injection. Safe by design.",
  },
] as const;

export const author = {
  email: "woodbird456@gmail.com",
  meshageId: "mubanjiu",
} as const;

export const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#cta", label: "Join waitlist" },
  { href: "#contact", label: "Contact" },
] as const;

export const cta = {
  primary: "Join waitlist",
  successMessage: "Thanks! We'll be in touch.",
  submitLabel: "Submit",
  submittingLabel: "Submitting…",
} as const;
