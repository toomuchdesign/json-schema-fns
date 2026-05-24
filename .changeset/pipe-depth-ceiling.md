---
'@toomuchdesign/json-schema-fns': patch
---

Drop the "experimental" label from the composition / `pipe*` API. Pipelines of at least 9 transformations are now verified across all four endorsed pipe libraries (pipe-ts, remeda, effect, ts-functional-pipe) — limited by pipe-ts's typed-overload cap of 9; the other three libraries support deeper pipelines. See `test/composition-pipe-depth-ceiling.test.ts` for per-library ceilings.
