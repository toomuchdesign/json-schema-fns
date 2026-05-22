# Type philosophy

The internal [`JSONSchema`](../src/utils/types/definitions.ts) type is a **structural subset** of JSON Schema Draft-07 (2018), not a reference type. Consumers who need a complete JSON Schema TypeScript reference should pull one from npm (e.g. [`json-schema-to-ts`](https://github.com/ThomasAribart/json-schema-to-ts), [`@types/json-schema`](https://www.npmjs.com/package/@types/json-schema)). This document explains what that means in practice, why forward-compatibility with later drafts (2019-09, 2020-12) falls out of the design, and how to decide when to extend the type.

## The subset rule

`JSONSchema` lists only the keywords this library actively reads or writes:

- Object structure: `type`, `properties`, `patternProperties`, `required`, `additionalProperties`, `unevaluatedProperties`
- Combinators: `allOf`, `anyOf`, `oneOf`, `not`
- Conditional applicators: `if`, `then`, `else`

Every other JSON Schema keyword (`title`, `description`, `$id`, `$defs`, `examples`, `default`, `deprecated`, `readOnly`, `writeOnly`, `const`, `enum`, `dependentRequired`, `propertyNames`, …) is intentionally **not** in the type. That is deliberate — not an oversight.

## Forward-compatibility is a design property

The library is built against Draft-07 but works in practice with schemas from Draft 2019-09 and Draft 2020-12 too. That isn't a separate compatibility layer — it falls out of the subset rule:

1. Every transformation acts on a small known set of Draft-07 keywords.
2. Every untouched key rides through structurally (see next section).

So a schema with `$dynamicRef`, `prefixItems`, or `propertyNames` passes through the library unchanged. We don't validate against the spec, we don't try to "understand" the keyword — we leave it alone. There is exactly one explicit forward extension: `unsealSchemaDeep` strips `unevaluatedProperties` (a Draft 2019-09 keyword) alongside `additionalProperties`. That's documented as part of the function's contract.

## Why omitted keywords still ride through

Listing more keywords in `JSONSchema` would not improve preservation. Untouched keys already survive the round trip thanks to two compounding mechanisms:

1. **`<const Schema extends JSONSchemaObject>` captures the full literal type** at the call site. The `extends` is a constraint check on known fields, not a shape filter — extra fields on `Schema` are retained.
2. **`MergeRecords<Schema, {...}>` is `Omit<Schema, K> & {...}`.** Every key the function does not explicitly override is preserved on the output type.

Example, with the current type definition unchanged:

```ts
const schema = {
  type: 'object',
  $id: 'https://example.com/user',
  title: 'User',
  examples: [{ name: 'Ada' }],
  $defs: { Inner: { type: 'string' } },
  properties: { name: { type: 'string' }, age: { type: 'number' } },
  required: ['name'],
} as const;

const result = omitProps(schema, ['age']);
// result.$id     → 'https://example.com/user'
// result.title   → 'User'
// result.examples → readonly [{ readonly name: 'Ada' }]
// result.$defs   → { readonly Inner: { readonly type: 'string' } }
```

All four metadata keywords survive as literal types even though none appear in `JSONSchema`. Adding them to the type would change nothing.

## When to extend `JSONSchema`

Add a keyword to [`src/utils/types/definitions.ts`](../src/utils/types/definitions.ts) only when **the library reads or writes it**. Some triggers:

- A new transformation needs to dispatch on the keyword (e.g. `if` / `then` / `else` joining the combinator skip list).
- An existing transformation must narrow against the keyword's shape (e.g. recognising `type` as either a literal or an array of literals).
- The runtime needs to enforce a constraint on the keyword's value type.

Do **not** add a keyword for any of the following reasons:

- "To declare support for a dialect" — that belongs in the README.
- "To preserve it through transformations" — already happens structurally; see above.
- "Because the spec lists it" — irrelevant unless the library acts on it.

## Relationship to `json-schema-to-ts`

The library is designed to pair with `json-schema-to-ts`'s `FromSchema`. The contract is: any `as const` schema literal that is valid under `json-schema-to-ts`'s `JSONSchema` type, and uses only the keywords this library knows how to transform, is accepted as input, and every output remains consumable by `FromSchema`. Keywords outside the library's transformation set — Draft-07 keywords we don't touch, or any post-Draft-07 keyword — ride through untouched, so `FromSchema` sees them on the output exactly as it did on the input.
