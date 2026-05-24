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

### M1.5 Package distribution polish

**Problem.** [package.json](../package.json) has only `main` and `types`. No `engines` field, no `exports` map.

**Decision: C — stay CJS, add `exports` map + `engines`.** Single-format CJS keeps the broadest compatibility (Node CJS native, Node ESM via interop, Bun/Deno, every bundler). Add `"engines": { "node": ">=20" }` (matches `.nvmrc` and `@tsconfig/node20`). Add an `"exports"` map with a single `"default"` entry so both `import` and `require` resolve to the same CJS file:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  }
}
```

Keep `"main"` and `"types"` for legacy resolvers. Build script unchanged (`tsc -p tsconfig.build.json`). TypeScript consumers on `moduleResolution: nodenext` are covered by `exports.types`. Provenance already wired — verify on next publish.

### M1.7 Preservation/touches column in README

**Problem.** Today there's no documented answer to "what happens to `description`, `default`, `examples`, `$id` after I call `pickProps`?".

**Decision: C (lean).** One paragraph in the README API intro stating the default ("All transformations preserve every keyword they don't explicitly touch"). Add a "Touches" column to the existing API table listing only the keywords each fn modifies. Move conflict-resolution rules (e.g., `mergeProps`: schema2 wins on top-level metadata via `...schema1, ...schema2`) into per-fn API sections — one or two sentences each. Combinator dispatch stays in [docs/combinators.md](combinators.md); link from the per-fn sections that need it. No exhaustive matrix.

### M1.8 Document the relationship to `json-schema-to-ts`'s types

**Problem.** [src/utils/types/definitions.ts](../src/utils/types/definitions.ts) defines a homegrown `JSONSchemaObject` type. The README sells the library as a `json-schema-to-ts` companion but the input type isn't `json-schema-to-ts`'s `JSONSchema`.

**Decision: A.** Keep the homegrown `JSONSchemaObject`. Add a short "Type compatibility" subsection in the README stating: any `as const` schema literal that is valid under `json-schema-to-ts`'s `JSONSchema` type and uses only the keywords listed in the dialect section is accepted as input, and every output is consumable by `FromSchema`. No new exports. The existing "Supported JSON Schema dialect" section covers the dialect + forward-compat property — extend it (or add an adjacent subsection) with the explicit `json-schema-to-ts` compatibility statement.

### M3.1 Repo files

**Decision:** Add `CONTRIBUTING.md` (real content: `prepare` hook gotchas, the "always `npm run build` after recursive type changes" rule from [CLAUDE.md](../CLAUDE.md), changeset workflow, the single-major-bump deprecation policy). Skip `SECURITY.md` — for a zero-runtime-dep typings library the attack surface is provenance (already wired). Existing issue templates stay as-is.

### M3.2 npm metadata

**Decision:** Expand `keywords` in [package.json](../package.json) (currently 5): add `draft-2020-12`, `draft-07`, `immutable`, `type-safe`, `composition`, `json-schema-to-ts`, `ajv`. Add `homepage` and `bugs` fields (`repository` is already set). One-line edits, no downside.

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
