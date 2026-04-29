# ADR-0002 — Component styles vs theme styles

- **Status:** Accepted
- **Date:** 2026-04-27

## Context

A web component in Shadow DOM can hold any styles — from structural geometry to brand colors and effects. If everything goes into `static styles`, the theme becomes part of the component code: changing the look of the library means editing TypeScript, and supporting several themes in parallel becomes impossible.

The library must support several visual themes (`default`, `glass`, and more later) that are switched by importing a single CSS file.

## Decision

Styles are split into two layers by purpose:

**1. Inside the component (`src/components/*.ts`, `static styles`) — structural baseline only:**

- `:host` layout (`display`, `:host([hidden])`, `:host([wide])`).
- Layout (`flex`, `grid`, `position`, `gap`, sizes, paddings required for geometry).
- A minimal neutral look — the component must look acceptable as a native element even if no theme is loaded. Use system colors (`Field`, `FieldText`, `ButtonFace`) and `border: 1px solid` without an explicit color.
- States that cannot be separated from behavior (e.g. a `transition` for the toggle thumb animation).

**Verification rule**: if you strip the theme away, the component must not turn into "a mess of elements". It must look like a minimal native counterpart.

**2. Inside the theme (`themes/*.css`) — everything visual:**

- Colors (background, text, borders, states).
- Effects — shadows, blurs, `backdrop-filter`, gradients.
- Border radii, font sizes, decorative paddings.
- Hover/focus/active styles that change appearance, not geometry.
- Transitions and animations that belong to the look, not to the behavior.

A theme is loaded with a single import (`themes/default.css` or `themes/glass.css`) and is applied through `::part()` (see [[0003 - ::part() as the styling API boundary]]).

## Consequences

- Any component can be viewed "as a native element" without a theme — useful for debugging and for understanding the structure.
- Themes are written and maintained independently from the components. A new theme means a new CSS file, no TypeScript edits.
- Themes are mutually exclusive: exactly one file from `themes/` is loaded at a time. This keeps the cascade simple and prevents styles from leaking between themes.
- When adding a new component, two things must happen at once: write the minimal `static styles` and add a block to `themes/default.css`.
- If a visual state cannot be expressed via `::part(...)` or a host attribute, the component must be changed so that it can (e.g. add a `data-*` on host or a part modifier) — instead of pushing the style back into the component "because it's easier".

## Alternatives

- Keep everything in `static styles` and parameterize via CSS Custom Properties. Rejected: the variable count grows out of hand quickly, effects like multi-layer inset shadows are awkward to express through variables, and adding a radically different theme (e.g. glass) forces conditional logic into the component itself.
- Use `::slotted` and light-DOM markup. Rejected: breaks encapsulation and defeats the point of web components.
