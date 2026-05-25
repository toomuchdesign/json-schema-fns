---
'@toomuchdesign/json-schema-fns': major
---

Release 1.0.0 — stability contract. The public API in `src/index.ts` now follows semver: breaking changes require a major bump. Output schemas are guaranteed valid under JSON Schema Draft-07 (verified with ajv on every fixture) and round-trip through `json-schema-to-ts`. The `pipe*` API is no longer labelled experimental. Scope decisions are documented in `docs/scope.md`.
