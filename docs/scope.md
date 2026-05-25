# Scope

Decisions about what's in and out of scope for `@toomuchdesign/json-schema-fns`. The public API in [src/index.ts](../src/index.ts) is the source of truth for what ships today.

## Out of scope

- `$ref` resolution / dereferencing
- Tuple-typed `items` / `prefixItems` transformations
- Combinator-aware variants of `pickProps` / `omitProps`

## Possible future additions

- **`requirePropsDeep` / `optionalPropsDeep`** — deep variants of the require/optional togglers. Unresolved design question ("no args = all" at every depth?). When picked up: mirror `pickPropsDeep`'s folder shape and reuse `DeepPaths<Schema>` from [src/pickPropsDeep/types.ts](../src/pickPropsDeep/types.ts).

## Settled — will not ship

- **Built-in pipe utility.** Pipe is adjacent plumbing, not the library's value prop. The four pipe libraries the README endorses (`pipe-ts`, `remeda`, `effect`, `ts-functional-pipe`) are well-maintained and let users pick the recursion-budget vs. ergonomics tradeoff themselves. Existing interop tests in [test/composition-pipe-packages-interop.test.ts](../test/composition-pipe-packages-interop.test.ts) prove the current setup works.
- **`setProp` / `withMeta`.** Pure sugar over `mergeProps` (schema2 wins on property conflicts; top-level metadata rides through `...schema2`). Adding them grows the API without adding power.
- **`nullable` / type widening.** Library stays opinion-free on the null-vs-undefined design debate. Schemas that already carry `type: [..., 'null']` continue to work via the widened `JSONSchemaType`.
- **`MIGRATION.md`.** Breaking surface for major bumps is small enough (e.g. the v1 Node 20 floor + `exports` map) that GitHub release notes cover it.
- **Property-based tests with `fast-check`.** Scope risk of a well-shaped `arbitraryJsonSchema()` outweighs the marginal correctness gain beyond the existing ajv-based meta-schema checks.
- **README "Non-goals" section.** This document is the source of truth for scope decisions; no duplication into the README.
