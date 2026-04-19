# CLAUDE.md

Project-specific guidance for `@toomuchdesign/json-schema-fns`. Read before editing.

## What this library does

Type-safe, immutable utilities that transform JSON Schema objects while preserving TypeScript type inference — intended to pair with `json-schema-to-ts`. The non-obvious constraint: every runtime transformation has a mirror **type-level** transformation, so `FromSchema<typeof transformed>` stays accurate.

## Public API

Each function has a direct variant + a `pipe*` variant. Exports live in [src/index.ts](src/index.ts):

- `omitProps` / `pickProps` / `pickPropsDeep` — property filtering (shallow and dot-notation deep)
- `mergeProps` — merge two object schemas
- `requireProps` / `optionalProps` — toggle required flags
- `sealSchemaDeep` / `unsealSchemaDeep` — recursively add/remove `additionalProperties: false`

## Project layout

Flat "one function per file" under `src/`, **except** [src/pickPropsDeep/](src/pickPropsDeep/) which is a folder (`index.ts` runtime + `types.ts` helpers). The folder pattern exists because `pickPropsDeep`'s helper types are isolated-testable; apply the same pattern if you add a similarly type-heavy function.

- [src/utils/](src/utils/) — runtime helpers (`isJSONSchemaObjectType`, `isRecord`, combinator-keyword checks)
- [src/utils/types/](src/utils/types/) — general-purpose type utilities (`MergeRecords`, `PickFromTuple`, `OmitFromTuple`, `CompactSchema`, `Simplify`, `TupleToUnion`, etc.)
- [test/](test/) — vitest tests, one per src file; [test/utils/](test/utils/) mirrors type-utility source layout

## Non-negotiable conventions

1. **Explicit return types on every `pipe*` function.** The closure they return expands the inner type alias inline, and with recursive types (notably `PickPropsDeep`) this hits `TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize` during `.d.ts` emission. The fix is `(): (schema: Schema) => SomeTypeAlias<...>` at the outer function. Applied consistently to all `pipe*` functions — keep it that way.

2. **Use `const` type parameters.** `<const Schema extends JSONSchemaObject>` is how the library preserves literal types from `as const` call sites. Don't drop the `const` modifier.

3. **Runtime returns include `undefined` slots intentionally.** You'll see `return { ...schema, required: required.length > 0 ? required : undefined, properties }` with `// @ts-expect-error not relying on natural type flow` above it. `CompactSchema<T>` strips `undefined` / `readonly []` at the type level, and vitest's `toEqual` treats `{a: undefined}` and `{}` as equal. This pattern is deliberate — don't "fix" the `@ts-expect-error`.

4. **`@internal` tag for non-public types.** Helpers in [src/pickPropsDeep/types.ts](src/pickPropsDeep/types.ts) are `export`ed so tests can import them, but each carries `@internal` in JSDoc. Don't re-export internals from [src/index.ts](src/index.ts).

5. **JSON Schema combinators are preserved.** Deep functions (`sealSchemaDeep`, `unsealSchemaDeep`) must not recurse into `allOf` / `anyOf` / `oneOf` / `not` arrays unless the key appears inside `properties` / `patternProperties` — see the `isArrayCombinatorKeyword` / `isObjectCombinatorKeyword` guards.

## Test conventions

- **Every test file uses `deepFreeze(schema)` + `expect(actual).toEqual(expected)` + `expectTypeOf(actual).toEqualTypeOf(expected)`** — runtime equality _and_ structural type equality, both checked.
- `as const` on every schema literal (otherwise inference widens).
- **Runtime error cases use `@ts-expect-error intentionally testing a scenario not allowed by types`** to assert the types also reject the input.
- Type-only tests live alongside integration tests and use `expectTypeOf<A>().toEqualTypeOf<B>()` with no runtime call — see [test/pickPropsDeep.types.test.ts](test/pickPropsDeep.types.test.ts) and [test/utils/OmitFromTuple.test.ts](test/utils/OmitFromTuple.test.ts) for the pattern.
- Vitest's type-check mode is enabled — type failures show up as test failures.

## `pickPropsDeep` semantics (non-obvious)

- **Whole wins.** Paths `['a', 'a.x']` keep all of `a` unchanged (not just `a.x`). The exact-key check is inlined as `K extends Paths[number]` in [src/pickPropsDeep/types.ts](src/pickPropsDeep/types.ts).
- **`required` is filtered at every level** based on which top-level segments of `Paths` touch each level — not just the root.
- **`DeepPaths<Schema>` constraint enforces valid paths at the call site.** Paths that don't exist in the schema are a compile error, not a runtime no-op.
- Out of scope for deep picking: `patternProperties`, combinators, tuple-typed array `items`. Match `pickProps` scope.

## Build / verify commands

- `npm run type:check` — `tsc --noEmit` against [tsconfig.json](tsconfig.json)
- `npm run build` — emits `.d.ts` + JS into `dist/`. Runs a stricter [tsconfig.build.json](tsconfig.build.json); catches `TS7056` serialization issues that `type:check` won't.
- `npm test` / `npx vitest --config ./vitest.config.mts --run` — test suite with coverage + type-check mode
- `npm run source:check` — prettier + type-check
- `npm run prepare` — pre-commit hook: runs all of the above + build. Do not `--no-verify` to bypass.

**Always run `npm run build` after touching recursive types.** `type:check` passes types but doesn't serialize declarations — only `build` surfaces `.d.ts` emission problems.

## Gotchas

- **Don't add stackblitz "Live demo" links to README unless you have a real URL** — they're tied to per-function forks.
- **Type widening in accumulator patterns.** A `WalkPaths<..., Acc extends { sub: readonly string[] }>`-style accumulator is tempting but TypeScript can widen `Acc['sub']` to `readonly string[]` inside the body, losing specific tuple inference. Been tried, failed. The current two-walk approach (`HasPathStartingWith` + `SubPathsFor`) is intentional.
- **Changesets.** [package.json](package.json) uses `@changesets/cli`. Contributors are expected to run `npx changeset` before a PR.
- **IDE file references.** When writing text for this workspace, use markdown links like `[file.ts](src/file.ts)` rather than backticks — the extension renders them as clickable.
