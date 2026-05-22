# Sealing/Unsealing combinators

JSON Schema [combinators](https://json-schema.org/understanding-json-schema/reference/combining) (`allOf`, `anyOf`, `oneOf`, `not`) and [conditional applicators](https://json-schema.org/understanding-json-schema/reference/conditionals) (`if` / `then` / `else`) compose sub-schemas into logical expressions. Naively adding or removing `additionalProperties: false` inside every sub-schema changes the logical meaning of the schema, so `sealSchemaDeep` / `unsealSchemaDeep` must recurse selectively.

## Decision table

|                        | Seal                                                                                                             | Unseal                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `allOf`                | 🚫 Skip — sealing each option would forbid properties declared in the siblings (their intersection becomes `{}`) | ✅ Recurse — unseal each option                                                                                  |
| `anyOf`                | ✅ Recurse — seal each option                                                                                    | ✅ Recurse — unseal each option                                                                                  |
| `oneOf`                | ✅ Recurse — seal each option                                                                                    | 🚫 Skip — unsealing would let options overlap and break mutual exclusivity                                       |
| `not`                  | 🚫 Skip — sealing the inner schema narrows it, which _widens_ what `not` matches (validation becomes looser)     | 🚫 Skip — unsealing the inner schema widens it, which _narrows_ what `not` matches (validation becomes stricter) |
| `if` / `then` / `else` | 🚫 Skip — sealing the `if` branch tightens its match set, silently changing when `then` / `else` fires           | 🚫 Skip — unsealing the `if` branch broadens its match set, with the same silent shift in branch selection       |

## Rationale

### `allOf` — skip on seal, recurse on unseal

`allOf` succeeds when a value matches **every** sub-schema. Sealing each option would require every value to carry only the props declared in that single option — but values typically carry the _union_ of props across the sub-schemas, so every such value would fail. Unsealing each option only broadens them, and the intersection of broader schemas is still at least as large as the original: semantics are preserved.

### `anyOf` — recurse in both directions

`anyOf` succeeds when a value matches **at least one** sub-schema. Sealing every option tightens each individually, which is exactly the user intent of "disallow extraneous props everywhere". Unsealing every option loosens each individually, matching the intent of "allow extras everywhere". Neither direction changes the logical structure.

### `oneOf` — recurse on seal, skip on unseal

`oneOf` succeeds when a value matches **exactly one** sub-schema. Sealing each option only narrows them, so a value that previously matched exactly one still matches exactly one (or zero). Unsealing, however, broadens each option: a value that originally matched a single option may now match several, turning a valid schema into one that always rejects. To preserve mutual exclusivity, unseal leaves `oneOf` untouched.

### `not` — skip in both directions

`not` inverts its inner schema. Any mutation of the inner schema inverts direction at the boundary:

- **Seal** narrows the inner schema → `not` accepts _more_ values → validation becomes looser than the user asked for.
- **Unseal** broadens the inner schema → `not` accepts _fewer_ values → validation becomes stricter than the user asked for.

Neither is safe as an automatic transformation, so `not` sub-schemas are left untouched.

### `if` / `then` / `else` — skip in both directions

`if` is a dispatch predicate: when a value matches `if`, the `then` branch applies; otherwise `else` applies. Mutating any of the three sub-schemas shifts which values trigger which branch, with no way to know whether the user wanted the new dispatch:

- **Sealing `if`** tightens its match set, so values that previously triggered `then` now fall through to `else`.
- **Unsealing `if`** broadens its match set, so values that previously went to `else` now trigger `then`.
- **Sealing or unsealing `then` / `else`** changes the validation result _within_ the branch, which may or may not be what the user intended depending on whether the conditional was modelling structural strictness or domain rules.

The whole `if` / `then` / `else` triple is treated as a single conditional construct and skipped in both directions to preserve dispatch and branch semantics together.

## Property-name collisions

When `allOf` / `anyOf` / `oneOf` / `not` / `if` / `then` / `else` appear as literal property names inside `properties` or `patternProperties`, they are **not** combinators or applicators — they are field keys. When the `*Child` helper encounters a `properties` / `patternProperties` keyword, it walks the map's values directly (bypassing the combinator-keyword dispatch) so property-named combinators always recurse normally.

## Summary

| Key                    | Seal behavior | Unseal behavior |
| ---------------------- | ------------- | --------------- |
| `allOf`                | skip          | recurse         |
| `anyOf`                | recurse       | recurse         |
| `oneOf`                | recurse       | skip            |
| `not`                  | skip          | skip            |
| `if` / `then` / `else` | skip          | skip            |
