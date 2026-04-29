# ADR-0003 — `::part()` as the styling API boundary

- **Status:** Accepted
- **Date:** 2026-04-27

## Context

Shadow DOM fully isolates a component's internals from external styles. For a theme (see [[0002 - Component styles vs theme styles]]) or a library consumer to influence the look, an explicit and controlled way to expose individual nodes is required.

The standard mechanism is the `part` attribute and the `::part()` selector. The alternatives (CSS variables, `::slotted`, open Shadow DOM) are either limited in expressive power or break encapsulation.

## Decision

Every meaningful element inside a component is given a `part`. Themes and consumers style the component exclusively through `::part(...)`.

**Rules:**

- Every structural node in `render` carries a `part="..."`. Nodes left without a `part` are wrappers nobody outside cares about.
- `part` names are `kebab-case` and reflect the role, not the implementation: `trigger`, `panel`, `option`, `track`, `knob`, `thumb`, `box`, `field`, `label`, `error`, `arrow`, `icon`, `input`, `textarea`, `control`, `root`.
- States are expressed through **part modifiers** in the form `name name--modifier`: `option option--selected`, `option option--active`, `arrow arrow--open`, `label label--floating`. The theme writes `::part(option--selected)` without needing to know about the parent.
- States that belong to the component as a whole are expressed as **reflected attributes on the host** (`checked`, `disabled`, `wide`, `data-invalid`, `data-filled`) and used in front of `::part()`: `vl-toggle-switch[checked]::part(track)`.
- `:hover`, `:focus-visible`, `:disabled`, `:checked`, `:focus-within` are applied directly to a part: `::part(trigger):hover`. This works.
- `::part()` does not combine with descendants. If you need to reference internal hierarchy, lift the state up (to the host or to the part itself via a modifier).

**What is not allowed:**

- Relying on the internal markup structure of the component. Themes and consumers see only a flat list of `part` nodes.
- Using `!important` in themes to override component styles. If the theme cannot win, the component is holding an extra style that should be removed (see [[0001 - Code minimalism]]).

## Consequences

- The styling API becomes explicit: the list of `part`s a component exposes is its public contract. Renaming a `part` is a breaking change.
- When a new component state is added, the question "how is it exposed externally?" must be answered immediately — either as a part modifier or as a host attribute. Otherwise the theme has nothing to react to.
- Themes look like long flat lists of `vl-x::part(y) { ... }` — that is fine and reads in a single glance.

## Alternatives

- Only host-level CSS variables. Rejected: complex effects (multi-layer shadows, distinct styles per state) are awkward to express via variables, and the variable set grows faster than the component structure does.
- Open Shadow DOM (`mode: open`) with selector-based styling. Rejected: it locks the internal structure, turning any component refactor into a breaking change.
