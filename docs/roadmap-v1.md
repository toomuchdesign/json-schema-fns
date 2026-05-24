# Roadmap to v1

Active worklist for shipping `@toomuchdesign/json-schema-fns@1.0.0`. Items that have shipped or were explicitly decided against are no longer listed — see git history and the `CHANGELOG.md` for what's already in. Milestone IDs (M1.x / M2.x / M3.x) are preserved for traceability with prior discussion.

## What v1 means

A 1.0 is a stability contract. After 1.0:

- The public API in [src/index.ts](../src/index.ts) follows semver — breaking changes require a major bump.
- The supported JSON Schema dialect is declared and tested.
- Output schemas are guaranteed to remain valid JSON Schemas under the declared dialect, verified with a validator (ajv) — not just structural deep-equal.
- Type-level outputs round-trip through `json-schema-to-ts` for the documented input shapes.
- The `pipe*` API is no longer labelled "experimental".

Things explicitly **out of scope** for 1.0:

- `$ref` resolution / dereferencing
- Tuple-typed `items` / `prefixItems` transformations
- Combinator-aware variants of `pickProps` / `omitProps`
- A built-in pipe utility (settled — not happening)

---

## Remaining 1.0 work

### M3.1 Repo files

**Decision:** Add `CONTRIBUTING.md` (real content: `prepare` hook gotchas, the "always `npm run build` after recursive type changes" rule from [CLAUDE.md](../CLAUDE.md), changeset workflow, the single-major-bump deprecation policy). Skip `SECURITY.md` — for a zero-runtime-dep typings library the attack surface is provenance (already wired). Existing issue templates stay as-is.

### M3.3 GitHub topics on the repo

**Decision:** Add topics matching the expanded npm keyword set. One-time, trivial, drives discoverability.

---

## Deferred to post-1.0 (1.x candidates)

- **`requirePropsDeep` / `optionalPropsDeep`** — deep variants of the require/optional togglers. Unresolved design question ("no args = all" at every depth?) better answered post-1.0. When picked up: mirror `pickPropsDeep`'s folder shape and reuse `DeepPaths<Schema>` from [src/pickPropsDeep/types.ts](../src/pickPropsDeep/types.ts).

## Settled — will not ship

- **Built-in pipe utility.** Pipe is adjacent plumbing, not the library's value prop. The four pipe libraries the README endorses (`pipe-ts`, `remeda`, `effect`, `ts-functional-pipe`) are well-maintained and let users pick the recursion-budget vs. ergonomics tradeoff themselves. Existing interop tests in [test/composition-pipe-packages-interop.test.ts](../test/composition-pipe-packages-interop.test.ts) prove the current setup works.
- **`setProp` / `withMeta`.** Pure sugar over `mergeProps` (schema2 wins on property conflicts; top-level metadata rides through `...schema2`). Adding them grows the API without adding power.
- **`nullable` / type widening.** Library stays opinion-free on the null-vs-undefined design debate. Schemas that already carry `type: [..., 'null']` continue to work via the widened `JSONSchemaType`.
- **`MIGRATION.md`.** 1.0 breaking surface is small enough (Node 20 floor, `exports` map enforcing the public entry point) that the GitHub release notes cover it.
- **Property-based tests with `fast-check`.** Scope risk of a well-shaped `arbitraryJsonSchema()` outweighs the marginal correctness gain beyond the existing ajv-based meta-schema checks.
- **README "Non-goals" section.** This roadmap doc is the source of truth for scope decisions; no duplication into the README.

## Deprecation policy

Single-major-bump removal: breaking changes land in the next major release with no deprecation period. Document under a "Versioning" section in `CONTRIBUTING.md` (M3.1).
