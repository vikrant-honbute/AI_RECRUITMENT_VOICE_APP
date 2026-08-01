# AI SaaS Website — Design System Specification

## 1. Context and Goals
This document defines implementation-ready UI/UX guidance for an AI SaaS marketing website. It covers design tokens and component-level rules only — no brand copy, company name, or content is assumed here beyond the visual theme below. The goal is a clean, functional, implementation-oriented interface that agentic coding tools can build directly from, with full accessibility (WCAG 2.2 AA) and no ambiguous rules.

## 2. Assumptions to Confirm
The following token values were not part of the original theme and were filled in to match its "clean, functional, implementation-oriented" direction. Confirm or override before build:

- **Accent/CTA color** (`color.action.primary` = `#171717`) — the theme only specified text and base surface colors, not a distinct action/accent color. Pick the real primary action color for your product and update this token.
- **Spacing scale** (8px-based: 4/8/12/16/24/32/48/64) — not part of the original theme; a standard scale chosen to fit the style direction.
- **Radius scale** (4 / 8 / 12px, pill for rounded buttons) — assumed small and consistent.
- **Shadow tokens** — assumed minimal/flat, matching "clean, functional."
- **Motion tokens** (150–200ms, ease-out) — assumed fast and subtle.
- **Border and feedback (success/error/focus) colors** — assumed neutral/standard, with the focus ring specifically chosen to meet the 3:1 non-text contrast requirement in WCAG 2.2.

## 3. Design Tokens and Foundations

### Typography
| Token | Value |
|---|---|
| `font.family.primary` | Figtree |
| `font.family.stack` | Figtree, Figtree Placeholder, sans-serif |
| `font.size.base` | 16px |
| `font.weight.base` | 500 |
| `font.lineHeight.base` | 20.8px |
| `font.size.xs` | 10px |
| `font.size.sm` | 11px |
| `font.size.md` | 12px |
| `font.size.lg` | 13px |
| `font.size.xl` | 14px |
| `font.size.2xl` | 16px |
| `font.size.3xl` | 18px |
| `font.size.4xl` | 22px |
| `font.weight.medium` | 500 |
| `font.weight.semibold` | 600 |
| `font.weight.bold` | 700 |
| `font.lineHeight.heading` | 1.2 |
| `font.lineHeight.body` | 1.5 |

Headings must use `font.weight.semibold` or `font.weight.bold`. Body copy must use `font.weight.base`. Sizes below `font.size.md` (12px) must not carry essential information — reserve them for labels/eyebrows only.

### Color
| Token | Value | Usage |
|---|---|---|
| `color.text.primary` | #404040 | Default body text |
| `color.text.secondary` | #0a0a0a | Headings, high-emphasis text |
| `color.text.tertiary` | #525252 | Supporting/caption text |
| `color.text.inverse` | #222222 | Text on dark/action surfaces |
| `color.surface.base` | #000000 | Page background / dark sections |
| `color.surface.muted` | #f5f5f5 | Cards, alternate section backgrounds |
| `color.action.primary` | #171717 | Primary button fill |
| `color.action.primaryHover` | #2b2b2b | Primary button hover fill |
| `color.border.default` | #e5e5e5 | Default dividers, input borders |
| `color.border.strong` | #a3a3a3 | Emphasized borders |
| `color.feedback.success` | #16794f | Success states |
| `color.feedback.error` | #b3261e | Error states |
| `color.feedback.focusRing` | #2563eb | Focus-visible outline |

Component guidance must reference these token names only — raw hex values must never appear in component-level rules.

### Spacing (8px base scale)
`space.2xs=4px`, `space.xs=8px`, `space.sm=12px`, `space.md=16px`, `space.lg=24px`, `space.xl=32px`, `space.2xl=48px`, `space.3xl=64px`

### Radius
`radius.sm=4px`, `radius.md=8px`, `radius.lg=12px`, `radius.pill=999px`

### Shadow
`shadow.none=none`, `shadow.sm=0 1px 2px rgba(0,0,0,0.06)`, `shadow.md=0 2px 8px rgba(0,0,0,0.08)`

### Motion
`motion.duration.fast=150ms`, `motion.duration.base=200ms`, `motion.easing.standard=cubic-bezier(0.2,0,0,1)`

## 4. Component-Level Rules

### Button
**Anatomy:** container, optional leading/trailing icon, label text.
**Variants:** `primary` (filled, `color.action.primary`), `secondary` (outlined, `color.border.strong`), `ghost` (text-only).

| State | Rule |
|---|---|
| Default | `color.action.primary` fill, `color.text.inverse` label, `radius.md` |
| Hover | Fill transitions to `color.action.primaryHover` over `motion.duration.fast` |
| Focus-visible | 2px `color.feedback.focusRing` outline, 2px offset — must never be suppressed |
| Active | Fill darkens an additional 8%; no layout shift |
| Disabled | 40% opacity, `cursor: not-allowed`, must not respond to hover/focus styling |
| Loading | Label replaced by an inline spinner sized to `font.size.lg`; button must retain its committed width to prevent layout shift; must be `aria-disabled="true"` and re-enable on completion or timeout |
| Error | Button itself does not carry error state — pair with an adjacent inline error message using `color.feedback.error` |

**Keyboard:** Enter and Space must both activate. **Pointer:** entire hit area (min 44×44px) must be clickable, not just the visible label. **Touch:** same 44×44px minimum; must not rely on `:hover` to convey state on touch devices.
**Responsive/edge cases:** long labels must truncate with ellipsis past 2 lines on mobile widths, never wrap the container into misalignment.

### Link
**Anatomy:** inline or standalone text with optional trailing icon (external/arrow).
**States:** default (`color.text.primary` or inherited), hover (underline appears, `motion.duration.fast`), focus-visible (`color.feedback.focusRing` outline, never `outline: none` without a replacement), active (color darkens 8%).
**Keyboard:** reachable via Tab in DOM order; Enter activates. **Pointer/touch:** minimum 44×44px tappable area when a link stands alone (nav/footer items), even if visible text is smaller.
**Edge cases:** external links must indicate destination (icon or `aria-label` suffix, e.g. "opens in new tab").

### Navigation
**Anatomy:** logo/home link, primary nav items, one primary CTA button.
**States:** default, hover, focus-visible (visible outline per item), active/current page (visually distinguished, e.g. `color.text.secondary` + underline, marked with `aria-current="page"`).
**Responsive:** below the mobile breakpoint, nav items must collapse into a keyboard-operable disclosure menu that traps focus while open; the CTA button should remain visible/pinned even when collapsed.
**Keyboard:** Tab through items in visual order; Escape closes any open mobile menu. **Touch:** all nav targets must meet the 44×44px minimum.

### Card
**Anatomy:** container (`color.surface.muted`, `radius.lg`), optional icon/image, heading, body text, optional action link or button.
**States:** default, hover (subtle `shadow.sm` → `shadow.md` lift over `motion.duration.fast` if the card is clickable as a whole), focus-visible (outline on the card or its inner action if interactive).
**Edge cases:** long headings/body text must not overflow the container — truncate or allow the card height to grow, never clip silently. Empty/placeholder cards (e.g. loading grid) must use a skeleton state, not blank space.

### List
**Anatomy:** container plus items — covers plain content lists (feature/benefit bullets) and interactive accordion lists (e.g. FAQ).
**States (plain list):** default only, unless items are also links, in which case apply Link rules per item.
**States (accordion list):** default (collapsed), hover (background shift on the trigger row), focus-visible (outline on the trigger), expanded/collapsed (must use `aria-expanded` on the trigger and `aria-controls` pointing to the panel).
**Keyboard:** accordion triggers reachable via Tab, toggle via Enter/Space. **Edge cases:** long content must not clip — panels expand to full content height, animated over `motion.duration.base`; an empty list should render nothing rather than an empty container.

### Form Input
**Anatomy:** label, input field, optional helper text, optional error message.
**States:** default (`color.border.default`), hover, focus-visible (`color.feedback.focusRing` outline), disabled (40% opacity), error (`color.feedback.error` border + message), success (`color.feedback.success` accent, optional).
**Keyboard:** must be reachable via Tab, with label programmatically associated (`for`/`id` or `aria-labelledby`). **Edge cases:** error messages must persist until the underlying issue is resolved, not just on blur.

## 5. Accessibility Requirements (WCAG 2.2 AA)
All criteria below must be verifiable with a concrete pass/fail check:

- **Contrast:** body text must measure ≥4.5:1 against its background; large text (≥18px, or ≥14px bold) must measure ≥3:1. Verify `color.text.tertiary` (#525252) against `color.surface.muted` (#f5f5f5) specifically — must pass 4.5:1 or be reserved for large text only.
- **Focus visibility:** every interactive element must show a focus-visible outline ≥2px with ≥3:1 contrast against its adjacent surface; never remove via `outline: none` without a compliant replacement.
- **Target size:** interactive controls must have a hit area ≥24×24px minimum, ≥44×44px for primary CTAs and standalone nav/footer links.
- **Keyboard operability:** every interactive component must be operable via keyboard alone, in a logical Tab order matching visual order, with no keyboard traps.
- **Reduced motion:** all `motion.*` transitions must respect `prefers-reduced-motion: reduce` by disabling non-essential animation.
- **Semantic structure:** one `h1` per page, no skipped heading levels; `nav`, `main`, `footer` landmarks present and unique.

## 6. Content and Tone Standards
Voice: concise, confident, implementation-focused.

- **Button labels** must be action-specific, never generic. Good: "Start free trial." Bad: "Click here" / "Submit."
- **Error messages** must state what went wrong and what to do next. Good: "Enter a valid work email to continue." Bad: "Invalid input."
- **Empty states** must explain what will appear and, where applicable, offer an action. Good: "No results match your filters — clear filters to see everything."

## 7. Anti-Patterns and Prohibited Implementations
- Do not hardcode hex values or raw pixel sizes inside component definitions — reference tokens only.
- Do not ship a button, link, nav item, or form field without explicit hover, focus-visible, active, and (where applicable) disabled/loading/error states.
- Do not remove focus outlines without a compliant replacement.
- Do not introduce one-off spacing or type sizes outside the defined scales.
- Do not use ambiguous action labels ("click here," "learn more" with no context).
- Do not rely on color alone to convey state (error, current-page nav, success) — pair with text, icon, or `aria-*` attributes.

## 8. QA Checklist
- [ ] All colors, spacing, radius, and type sizes trace back to a named token — zero raw values in component code.
- [ ] Every interactive component has default, hover, focus-visible, active, disabled (if applicable), loading (if applicable), and error (if applicable) states implemented and visually distinct.
- [ ] Keyboard navigation covers 100% of interactive elements in logical order; no traps.
- [ ] Contrast checked and passing for all text/background pairs actually used, including `color.text.tertiary` on `color.surface.muted`.
- [ ] All tap targets meet minimum size requirements on mobile viewports.
- [ ] Reduced-motion preference disables non-essential transitions.
- [ ] Nav collapses correctly at the mobile breakpoint and remains keyboard-operable.
- [ ] Accordion items expose `aria-expanded`/`aria-controls` correctly and animate without clipping content.
- [ ] No placeholder or "TBD" values remain anywhere in the shipped document.
