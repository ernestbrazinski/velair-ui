# ADR-0001 — Code minimalism

- **Status:** Accepted
- **Date:** 2026-04-27

## Context

Web components tend to accumulate auxiliary code over time: attribute converters, id generators, getter wrappers around trivial expressions, props kept "for the future", slots added "in case someone needs them". This kind of code hides the actual component logic and makes refactoring and theming harder.

## Decision

Components are written to be as minimal, clean and readable as possible. Nothing extra:

- The component contains no code that is not used by at least one public scenario.
- Variable and method names are meaningful. Abbreviations like `_hi`, `_n`, `trig`, `chev` are forbidden.
- If a field or prop can be derived from existing ones, it is not stored separately.
- Attribute converters and id generators are introduced only when there is no way around them. The default is the native Lit type (`String` / `Boolean` / `Number`).
- If a feature is not used in the library and has not been requested, it is removed rather than kept "just in case".

## Consequences

- Any single component must fit in your head as a whole — from props to render. If it stops fitting, the component needs to be decomposed or cleaned up.
- Breaking API changes during cleanup are acceptable while the library is still stabilising. Each such cleanup is recorded in the CHANGELOG / commit message.
- New code is reviewed against the question "can this be deleted without breaking anything". If the answer is yes — it is deleted.

## Alternatives

- Preserve the full API history for the sake of backward compatibility. Rejected: the library is not yet frozen, and the price is unreadable code.
