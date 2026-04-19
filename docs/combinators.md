# Sealing/Unsealing combinators

JSON Schema [combinators](https://json-schema.org/understanding-json-schema/reference/combining) (`allOf`, `anyOf`, `oneOf`, `not`) compose sub-schemas into logical expressions. Naively adding or removing `additionalProperties: false` inside every sub-schema changes the logical meaning of the schema, so `sealSchemaDeep` / `unsealSchemaDeep` must recurse selectively.

## Decision table

|         | Seal                                                                                                             | Unseal                                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `anyOf` | ✅ Recurse — seal each option                                                                                    | ✅ Recurse — unseal each option                                                                                  |
| `oneOf` | ✅ Recurse — seal each option                                                                                    | 🚫 Skip — unsealing would let options overlap and break mutual exclusivity                                       |
| `allOf` | 🚫 Skip — sealing each option would forbid properties declared in the siblings (their intersection becomes `{}`) | ✅ Recurse — unseal each option                                                                                  |
| `not`   | 🚫 Skip — sealing the inner schema narrows it, which _widens_ what `not` matches (validation becomes looser)     | 🚫 Skip — unsealing the inner schema widens it, which _narrows_ what `not` matches (validation becomes stricter) |

## Rationale

### `anyOf` — recurse in both directions

`anyOf` succeeds when a value matches **at least one** sub-schema. Sealing every option tightens each individually, which is exactly the user intent of "disallow extraneous props everywhere". Unsealing every option loosens each individually, matching the intent of "allow extras everywhere". Neither direction changes the logical structure.

### `oneOf` — recurse on seal, skip on unseal

`oneOf` succeeds when a value matches **exactly one** sub-schema. Sealing each option only narrows them, so a value that previously matched exactly one still matches exactly one (or zero). Unsealing, however, broadens each option: a value that originally matched a single option may now match several, turning a valid schema into one that always rejects. To preserve mutual exclusivity, unseal leaves `oneOf` untouched.

### `allOf` — skip on seal, recurse on unseal

`allOf` succeeds when a value matches **every** sub-schema. Sealing each option would require every value to carry only the props declared in that single option — but values typically carry the _union_ of props across the sub-schemas, so every such value would fail. Unsealing each option only broadens them, and the intersection of broader schemas is still at least as large as the original: semantics are preserved.

### `not` — skip in both directions

`not` inverts its inner schema. Any mutation of the inner schema inverts direction at the boundary:

- **Seal** narrows the inner schema → `not` accepts _more_ values → validation becomes looser than the user asked for.
- **Unseal** broadens the inner schema → `not` accepts _fewer_ values → validation becomes stricter than the user asked for.

Neither is safe as an automatic transformation, so `not` sub-schemas are left untouched.

## Property-name collisions

When `allOf` / `anyOf` / `oneOf` / `not` appear as literal property names inside `properties` or `patternProperties`, they are **not** combinators — they are field keys. When the `*Child` helper encounters a `properties` / `patternProperties` keyword, it walks the map's values directly (bypassing the combinator-keyword dispatch) so property-named combinators always recurse normally.

## Summary

| Key     | Seal behavior | Unseal behavior |
| ------- | ------------- | --------------- |
| `allOf` | skip          | recurse         |
| `anyOf` | recurse       | recurse         |
| `oneOf` | recurse       | skip            |
| `not`   | skip          | skip            |
