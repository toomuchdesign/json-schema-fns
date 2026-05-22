# Roadmap to v1

This is a working proposal for what `@toomuchdesign/json-schema-fns` needs to ship a credible `1.0.0` — a release that real-world consumers can adopt without footnotes. Each item lists the problem, a concrete proposal, and the files most likely to change. The document is intentionally opinionated; treat each section as a starting point for discussion, not a decision.

## What v1 means

A 1.0 is a stability contract. After 1.0:

- The public API in [src/index.ts](../src/index.ts) follows semver — breaking changes require a major bump.
- The supported JSON Schema dialect(s) are declared and tested.
- Output schemas are guaranteed to remain valid JSON Schemas under the declared dialect, verified with a validator (ajv) — not just structural deep-equal.
- Type-level outputs round-trip through `json-schema-to-ts` for the documented input shapes.
- The `pipe*` API is no longer labelled "experimental".

Things explicitly **out of scope** for 1.0 (kept as 1.x candidates so we can reject scope creep without rehashing it):

- `$ref` resolution / dereferencing
- Tuple-typed `items` / `prefixItems` transformations
- Combinator-aware variants of `pickProps` / `omitProps`
- A built-in pipe utility (the existing README "Todo")

---

## Milestone M1 — Stabilization (blocking 1.0)

Items here are required to call the release 1.0 with a straight face. Most are not new features — they are decisions, tests, and packaging.

### M1.1 Declare the supported JSON Schema dialect

**Problem.** The README never says which draft is the contract. The hand-rolled [`JSONSchema`](../src/utils/types/definitions.ts) type covers a Draft-07 / 2020-12 intersection and ignores `dependentRequired`, `dependentSchemas`, `prefixItems`, `propertyNames`, and `const`. Without a stated dialect, every edge case is a judgment call.

**Proposal.**

- Declare **JSON Schema Draft 2020-12** as the primary dialect, with a documented "Draft-07 compatible subset" callout for the keywords both drafts share.
- Audit [src/utils/types/definitions.ts](../src/utils/types/definitions.ts) and extend `JSONSchema` to recognise the keywords we promise to preserve: `dependentRequired`, `dependentSchemas`, `propertyNames`, `const`, `enum`, `$id`, `$ref`, `$defs`, `$schema`, `title`, `description`, `default`, `examples`, `deprecated`, `readOnly`, `writeOnly`. They don't need transformation logic — they need to survive a spread without TS narrowing them away.
- Add a "Supported keywords" matrix to the README alongside the existing combinators table (see M1.7).

**Files affected:** [README.md](../README.md), [src/utils/types/definitions.ts](../src/utils/types/definitions.ts), [docs/](.).

**Decision: A.** Declared dialect is JSON Schema 2020-12; Draft-07 schemas continue to work as a subset. Extend `JSONSchema` to recognize the full 2020-12 keyword set as documented above (metadata, validation, and 2020-12 structural keywords) — no transform logic, keywords ride through `...schema` spreads. Widen `type` to `JSONSchemaType | readonly JSONSchemaType[]` to support array forms (`type: ['string', 'null']`). Add `if`/`then`/`else` to the combinator dispatch in `sealSchemaDeep` / `unsealSchemaDeep` with a "skip" policy (mirrors `not`); update [docs/combinators.md](combinators.md). Validator dialect for M1.3 is the 2020-12 meta-schema (`ajv/dist/2020`).

### M1.2 De-experimentalize the `pipe*` API

**Problem.** README currently warns the pipe API is "experimental" and may hit `TS2589: Type instantiation is excessively deep`. Shipping 1.0 with that wording undermines the headline value (composability).

**Proposal.**

- The mitigation pattern documented in [CLAUDE.md §Non-negotiable conventions #1](../CLAUDE.md) — explicit return types on `pipe*` functions — is already applied across the codebase (verified in [src/omitProps.ts:62](../src/omitProps.ts) and [src/pickPropsDeep/index.ts:90](../src/pickPropsDeep/index.ts)). The TS2589 risk now manifests only at the **call site** when many `pipe*` calls compose.
- Quantify the limit: extend [test/composition-pipe-deep-recursion.test.ts](../test/composition-pipe-deep-recursion.test.ts) into a matrix that pipes N transformations of a representative schema and finds the N at which TS2589 fires across `{pipe-ts, ts-functional-pipe, effect, remeda}`. The result becomes a single sentence in the README ("pipelines up to N stages supported on TypeScript ≥ X; beyond that, split the pipeline").
- Remove the "(experimental)" suffix and the recursion warning from [README.md](../README.md). Replace with the measured limit.

**Decision: A.** Measure the depth ceiling across `{pipe-ts, ts-functional-pipe, effect, remeda}` × `{4, 8, 12, 16, 24}` stages, run against both the simple schema already in the test and the `largeSchema` mock. Phrase the README claim as "at least N stages verified" (consumer ceilings will be higher than the test's, since `expectTypeOf` consumes its own instantiation budget). Drop the "experimental" label and the TS2589 warning once measured.

### M1.3 Round-trip correctness against ajv

**Problem.** Tests today verify structural equality of input/output schemas and TS types. They do **not** verify that the output schema is itself a valid JSON Schema under the declared dialect, nor that it accepts/rejects the same instances as expected.

**Proposal.**

- Add `ajv` (with `ajv-formats` and the 2020-12 meta-schema) as a dev dependency.
- For each fn, add a `test/semantic/<fn>.test.ts` that:
  1. Compiles the input schema with ajv against the 2020-12 meta-schema (sanity).
  2. Compiles the **output** schema with ajv (validity — the key new check).
  3. Defines a small set of fixture instances and asserts the documented semantic delta (e.g., for `omitProps`, instances missing the omitted prop should now validate where they didn't before, if that prop was required).
- Keep the existing structural tests as-is — they assert type-level behavior too.

**Why this is the single highest-leverage item.** Once ajv is verifying outputs, a whole class of "the types are right but the runtime is subtly wrong" bug becomes a regression instead of a post-release report.

**Decision: A.** Both meta-schema validity and instance semantics per fn. Dev deps: `ajv`, `ajv-formats`. Shared helpers in `test/semantic/utils.ts` (`assertValidSchema`, `assertValidates`). One `test/semantic/<fn>.test.ts` per public function (8 files). Each contains: (1) one assertion that output passes the 2020-12 meta-schema; (2) ~3 fixture instances asserting the documented semantic delta against the input vs. output schema.

### M1.4 Property-based tests for round-trip laws

**Decision: skipped.** Not in scope for 1.0. M1.3's ajv-based semantic tests are the trust floor; property-based laws are a force multiplier that can be added in a later release once the cost of a well-shaped `arbitraryJsonSchema()` is known. If we want example-based law assertions cheaply, the right home is a `test/laws/` file using a small hand-written fixture pool — but that's also not 1.0 scope.

### M1.5 Package distribution polish

**Problem.** [package.json](../package.json) has only `main` and `types`. Modern ESM-only consumers either hit "no exports field" warnings or fall back to Node's legacy resolution. There's no `engines` field and no decision on ESM vs CJS publishing.

**Proposal.**

- Confirm what `dist/` is actually shipping today. With `@tsconfig/node20` and no `"type": "module"` in [package.json](../package.json), it is CJS.
- Pick one of:
  - **Option A (recommended):** dual ESM + CJS via `tsup` (zero-config for a library of this size). Update `package.json`:
    ```json
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js",
        "require": "./dist/index.cjs"
      }
    }
    ```
  - **Option B:** ESM-only. Add `"type": "module"` and an `exports` map. CJS consumers must use dynamic `import()`. Document loudly.
- Add `"engines": { "node": ">=20" }` (matches `@tsconfig/node20`).
- `"sideEffects": false` is already set — good.
- Provenance is already wired in [.github/workflows/release.yml:50](../.github/workflows/release.yml) (`NPM_CONFIG_PROVENANCE: true`). Verify the next published tarball shows the provenance badge on npm.

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

### M1.6 Real demo links (or remove them)

**Problem.** README links eight separate "Live demo" stackblitz URLs that all share the same fork ID (`vitejs-vite-aglzxc19`) with different `?file=` query strings. [CLAUDE.md §Gotchas](../CLAUDE.md) explicitly warns against this.

**Proposal.**

- Audit each demo link. For each one that doesn't open to the documented file, either:
  - Fork the playground per-fn and pin a real URL, or
  - Replace the eight per-fn links with one top-level "Open the playground" link, with a note telling users to open the file matching each example.

**Decision: B.** Replace the eight per-fn stackblitz links with one top-level "Try it live" link above the API section, pointing at a single playground project that contains one file per public function. Delete the "Live demo ⚡" column from the API table and the eight `[*-demo]` reference-style links at the bottom of [README.md](../README.md). Verify the playground contains `src/<fnName>.ts` for every public fn, or commit one that does.

### M1.7 Preservation table in README

**Problem.** Today there's no documented answer to "what happens to `description`, `default`, `examples`, `$id` after I call `pickProps`?". Real users care.

**Proposal.**

- After M1.1 settles the supported-keyword list, add a single matrix table: input keyword × function → `preserved` / `transformed` / `dropped` / `n/a`.
- For the deep functions (`sealSchemaDeep`, `unsealSchemaDeep`, `pickPropsDeep`), include a "recurses into" column documenting the combinator dispatch rules already captured in [docs/combinators.md](combinators.md).

**Decision: C (leaner variant).** One paragraph in the README API intro stating the default ("All transformations preserve every keyword they don't explicitly touch"). Add a "Touches" column to the existing API table listing only the keywords each fn modifies. Move conflict-resolution rules (e.g., `mergeProps`: schema2 wins on top-level metadata via `...schema1, ...schema2`) into per-fn API sections — one or two sentences each. Combinator dispatch stays in [docs/combinators.md](combinators.md); link from the per-fn sections that need it. No exhaustive matrix; if a migration-audit workflow asks for one later, we add it then.

### M1.8 Decide the relationship to `json-schema-to-ts`'s types

**Problem.** [src/utils/types/definitions.ts](../src/utils/types/definitions.ts) defines a homegrown `JSONSchema` type that is "intentionally simplified" (per CLAUDE.md §Dev notes). The README sells the library as a `json-schema-to-ts` companion, but the input type isn't `json-schema-to-ts`'s `JSONSchema`.

**Proposal.** Three options:

- **A. Keep homegrown, document the relationship.** Add a paragraph: "inputs are accepted against a structural subset of JSON Schema; any schema valid under `json-schema-to-ts`'s `JSONSchema` type that also satisfies the keywords listed in M1.1 is accepted." Lowest risk; preserves the type-perf work that has already happened.
- **B. Replace with `JSONSchema` from `json-schema-to-ts`.** Simpler story but couples 1.0 to that library's type evolution and risks reintroducing the recursion problems that motivated the homegrown type in the first place.
- **C. Provide both:** export a `LooseJSONSchema` alias for users who want to plug `json-schema-to-ts` types in directly; keep the strict one as the default.

Recommendation: **A**, plus the explicit sentence in the README contract.

**Decision: A.** Keep the homegrown `JSONSchemaObject` (preserves the type-perf work from 0.5.0 / 0.6.0 / 0.8.0). Add a short "Type compatibility" subsection in the README stating: any `as const` schema literal that is valid under `json-schema-to-ts`'s `JSONSchema` type and uses only the keywords listed in M1.1 is accepted as input, and every output is consumable by `FromSchema`. No new exports. If a concrete adapter use case (option C) shows up post-1.0, it can be added as a non-breaking export.

### M1.9 Migration note for 0.x → 1.x

**Problem.** There has been at least one rename in 0.x history (`sealSchema` → `sealSchemaDeep` in 0.4.0). Any rename or behavior change introduced in 1.0 needs a clean upgrade story.

**Proposal.** Add `MIGRATION.md` covering only breaking changes. One section per change with a before/after snippet. Keep the changeset-generated [CHANGELOG.md](../CHANGELOG.md) as the line-by-line history.

**Decision: D — skip.** The 1.0 breaking surface is small (Node 20 floor via `engines`, `exports` map enforcing the public entry point, no API renames). The GitHub release notes for 1.0 will cover both items in a paragraph each, which is sufficient given the narrow blast radius. If a future major introduces a larger surface, revisit and add `MIGRATION.md` then.

---

## Milestone M2 — Surface completion (mostly 1.x, some 1.0)

Real-world ergonomic gaps. Most don't block 1.0 but make adoption obviously better. Each item is tagged.

### M2.1 Deep variants of `requireProps` / `optionalProps` / `omitProps`

**Problem.** `requireProps` and `optionalProps` operate only on the top-level object. Users with nested schemas (the same users for whom `pickPropsDeep` exists) have to compose by hand.

**Proposal.**

- Mirror `pickPropsDeep`'s shape: `requirePropsDeep(schema, paths)`, `optionalPropsDeep(schema, paths)`, `omitPropsDeep(schema, paths)`.
- Reuse `DeepPaths<Schema>` from [src/pickPropsDeep/types.ts](../src/pickPropsDeep/types.ts) — the constraint logic is isolated-testable for exactly this reason.
- Same folder pattern as `pickPropsDeep` (`src/<name>/index.ts` + `types.ts`).

**Tag:** 1.x.

**Decision:** Ship **`omitPropsDeep` in 1.0**; defer `requirePropsDeep` / `optionalPropsDeep` to 1.x. `omitPropsDeep` closes the most jarring asymmetry (pick has a deep, omit doesn't) and the runtime is a near-mirror of [src/pickPropsDeep/index.ts](../src/pickPropsDeep/index.ts) with `DeepPaths<Schema>` reused as-is. The deep require/optional variants have an unresolved design question ("no args = all" at every depth?) better answered post-1.0 under no pressure. Combined with M2.2: ship `renameProps` alongside it as the only true new primitive needed for 1.0.

### M2.2 Property setters: `renameProps`, `setProp`, `withMeta`

**Problem.** `mergeProps` is the only "add" operation today, and it requires composing an entire schema. Common real cases:

- Rename a property (`id` → `userId`) while preserving its position in `required`.
- Set or replace a single property by key.
- Attach/override metadata (`title`, `description`, `default`, `examples`) without touching `properties`.

**Proposal.**

```ts
renameProps(schema, { id: 'userId', email: 'emailAddress' });
setProp(schema, 'key', { type: 'string' }); // add or replace
withMeta(schema, { title: '...', description: '...' });
```

All shallow. Type-level mirrors are straightforward `Omit`/`Pick`/`MergeRecords` compositions.

**Tag:** **1.0** for `renameProps` (it's missing today, easy, and frequently asked). `setProp` / `withMeta` 1.x.

**Decision:** `setProp` and `withMeta` are pure sugar over `mergeProps` (schema2 wins on property conflicts; top-level metadata rides through `...schema2`). Adding them grows the API without adding power — **dropped**. `renameProps` is the only true new primitive in this group; the M2.2 decision narrows to "ship `renameProps` in 1.0 or defer to 1.x" and is settled together with M2.1.

### M2.3 `nullable` / type widening

**Decision: dropped.** The library stays opinion-free on the null-vs-undefined design debate. Schemas that already carry `type: ['string', 'null']` (from upstream APIs, DBs, codegen) continue to work — M1.1 widens the type to accept the array form, so the keyword survives spreads and `FromSchema` still infers `T | null`. What we don't ship is a single-call helper that encourages adding `null` to types that didn't have it. Users who want that can compose `mergeProps` with a hand-written nullable schema.

### M2.4 Typed runtime errors

**Problem.** [src/utils/isJSONSchemaObjectType.ts](../src/utils/isJSONSchemaObjectType.ts) does throw `new Error(...)` with a usable message — but it's a base `Error`, not a typed class. Users can't `catch (e instanceof JsonSchemaFnsError)` to distinguish library failures from their own.

**Proposal.**

- Introduce a single `JsonSchemaFnsError extends Error` with a discriminator field (e.g., `code: 'INVALID_INPUT' | ...`).
- Replace the two `throw new Error(...)` sites in [src/utils/isJSONSchemaObjectType.ts](../src/utils/isJSONSchemaObjectType.ts).
- Export the class from [src/index.ts](../src/index.ts).

**Tag:** **1.0**. Cheap and avoids a future major bump.

**Decision: B — throw `TypeError`.** Replace the two `new Error(...)` sites in [src/utils/isJSONSchemaObjectType.ts](../src/utils/isJSONSchemaObjectType.ts) with `new TypeError(...)` (same messages). `TypeError` is exactly the JS-standard semantic for "wrong type of argument" — no new export, no docs surface, consumers can already discriminate via `e instanceof TypeError`. Add one sentence to the README API intro stating that public functions throw `TypeError` on non-object input as defense-in-depth against `any`/`unknown` flowing through the type system.

### M2.5 Out-of-scope items, formally listed

**Problem.** Today the README's API table reads as "everything we do" but doesn't say what we explicitly chose not to do. That gap invites issues and PRs that we then close as out-of-scope.

**Proposal.** Add a short "Non-goals" section to the README enumerating the out-of-scope items from this document's intro. Link to this roadmap for the rationale.

**Decision: skip.** No "Non-goals" section in the README, no link to this roadmap from the README. The roadmap doc remains the source of truth for scope decisions; users who want to know what's planned or out-of-scope can read it directly via the repo. Keeps the README focused on what the library does, not what it doesn't.

---

## Milestone M3 — Repo & community polish

### M3.1 Repo files

- `CONTRIBUTING.md` — workflow expectations (the `npx changeset` step, the build-before-merge requirement from CLAUDE.md, the prettier + type-check + test + build pre-commit hook).
- `SECURITY.md` — a single sentence pointing to the email or GitHub Security Advisories.
- The existing [.github/ISSUE_TEMPLATE](../.github/ISSUE_TEMPLATE) is fine; consider adding a "question" template that nudges users to Discussions.

**Decision:** Add `CONTRIBUTING.md` (real content: `prepare` hook gotchas, the "always `npm run build` after recursive type changes" rule from CLAUDE.md, changeset workflow). Skip `SECURITY.md` — for a zero-runtime-dep typings library the attack surface is provenance (already wired) and adding the file for compliance theater is the wrong reason. Existing issue templates stay as-is.

### M3.2 npm metadata

- Expand `keywords` in [package.json](../package.json) (currently 5): add `draft-2020-12`, `draft-07`, `immutable`, `type-safe`, `composition`, `json-schema-to-ts`, `ajv`. This is unglamorous but it's how the package gets found.
- Add `homepage` and `bugs` fields (`repository` is already set).

**Decision:** Expand keywords as listed and add `homepage` / `bugs` fields. One-line edits, no downside.

### M3.3 GitHub topics on the repo

Add the same keyword set as repo topics. One-time, trivial, drives discoverability.

**Decision:** Add topics matching the expanded npm keyword set.

---

## 1.0 cut (decided)

The items below are in scope for the 1.0 release. See each section for the decision rationale.

**Type & behavior surface**

- **M1.1** Declare 2020-12 dialect; widen `JSONSchema` to recognize the full 2020-12 keyword set; widen `type` to `JSONSchemaType | readonly JSONSchemaType[]`; add `if`/`then`/`else` to combinator dispatch ("skip" policy mirroring `not`).
- **M1.2** De-experimentalize the `pipe*` API; measure depth ceiling across `{pipe-ts, ts-functional-pipe, effect, remeda}` × `{4, 8, 12, 16, 24}` stages; phrase README claim as "at least N stages verified".
- **M2.1** Ship `omitPropsDeep` (1.0); defer `requirePropsDeep` / `optionalPropsDeep` to 1.x.
- **M2.2** Ship `renameProps` (1.0); drop `setProp` and `withMeta` (sugar over `mergeProps`).
- **M2.4** Replace `new Error(...)` with `new TypeError(...)` in [src/utils/isJSONSchemaObjectType.ts](../src/utils/isJSONSchemaObjectType.ts).

**Testing**

- **M1.3** Add ajv (2020-12 meta-schema) + `ajv-formats`; one `test/semantic/<fn>.test.ts` per public function covering meta-schema validity and instance-level semantic deltas.

**Packaging**

- **M1.5** Stay CJS-only (broadest compatibility); add `"engines": { "node": ">=20" }`; add `"exports"` map with a single `"default"` entry plus `"types"`; keep `"main"` / `"types"` for legacy resolvers. Build script unchanged. Verify provenance on next publish.

**Documentation**

- **M1.7** README "Touches" column listing only the keywords each fn modifies; per-fn conflict-resolution notes (e.g., `mergeProps` schema2 wins on top-level metadata); combinator dispatch stays in [docs/combinators.md](combinators.md).
- **M1.8** "Type compatibility" subsection in the README documenting the relationship to `json-schema-to-ts` (any compatible `as const` schema literal using M1.1 keywords is accepted; output is `FromSchema`-consumable).
- **M1.6** Replace eight per-fn stackblitz links with one top-level "Try it live" link pointing at a single playground that contains one file per public fn.

**Repo polish**

- **M3.1** Add `CONTRIBUTING.md` (the `prepare` hook gotchas, the "always `npm run build` after recursive types" rule from CLAUDE.md, changeset workflow). Skip `SECURITY.md`.
- **M3.2** Expand npm `keywords`; add `homepage` and `bugs` fields.
- **M3.3** Add matching GitHub repo topics.

## Explicitly excluded from 1.0

- **M1.4** Property-based tests with `fast-check` — skipped entirely (scope risk of building a well-shaped `arbitraryJsonSchema()` outweighs the marginal correctness gain beyond M1.3).
- **M1.9** `MIGRATION.md` — skipped (the 1.0 breaking surface is small enough that the GitHub release notes cover it).
- **M2.3** `nullable` / type widening — dropped (library stays opinion-free on the null-vs-undefined debate; schemas that *already* carry `type: [..., 'null']` continue to work via M1.1).
- **M2.5** README "Non-goals" section — skipped (this roadmap doc is the source of truth; no need to duplicate into the README).
- Deferred to 1.x: `requirePropsDeep`, `optionalPropsDeep`, `setProp`, `withMeta`, fast-check law suite.

## Open questions

These don't have a clear answer yet and probably want a separate issue each:

1. ~~Do we want to ship our own pipe utility?~~ **Decision: no.** Pipe is adjacent plumbing, not the library's value prop. The four pipe libraries the README already endorses are well-maintained and let users pick the recursion-budget vs. ergonomics tradeoff themselves; the existing interop tests in [test/composition-pipe-packages-interop.test.ts](../test/composition-pipe-packages-interop.test.ts) prove the current setup works. Remove the "Todo" line from the README.
2. ~~Should `pickPropsDeep` semantics be tightened?~~ **Decision: no — bake "whole wins" in for 1.0.** The defensive-composition case (`[...userPaths, 'a']`) makes the current rule natural; tightening would require type-level path-conflict detection for a behavior nobody has reported issues with. Promote the rule from CLAUDE.md into README-level documentation so it's discoverable by users, not just maintainers.
3. ~~Deprecation policy after 1.0?~~ **Decision: single-major-bump removal.** Breaking changes land in the next major release with no deprecation period. Document the policy in `CONTRIBUTING.md` (M3.1) under a "Versioning" section.
