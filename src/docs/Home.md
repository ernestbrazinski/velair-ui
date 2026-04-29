# Velair UI — architecture vault

This vault holds the architectural decisions and principles the library is built on.

## Layout

- **[[ADR/_template|ADR template]]** — starting point for new records.
- **ADR/** — Architecture Decision Records, one decision per file, sequential numbering.

## Accepted decisions

- [[ADR/0001 - Code minimalism]]
- [[ADR/0002 - Component styles vs theme styles]]
- [[ADR/0003 - ::part() as the styling API boundary]]

## How to add an ADR

1. Copy `ADR/_template.md`.
2. Name it `NNNN - Short title.md` where `NNNN` is the next sequential number.
3. Fill in context, decision and consequences.
4. Add a link to this file.
5. Do not edit accepted ADRs. If a decision is revisited, create a new ADR with status *Supersedes ADR-NNNN* and mark the old one *Deprecated*.
