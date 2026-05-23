# @toomuchdesign/json-schema-fns

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

`@toomuchdesign/json-schema-fns` is a type-safe immutable utility library for transforming JSON Schemas.

It ensures that schema transformations not only update the runtime schema correctly but also preserve accurate TypeScript type inference. This makes it especially useful when paired with tools like [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts).

```ts
import { omitProps } from '@toomuchdesign/json-schema-fns';
import type { FromSchema } from 'json-schema-to-ts';

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['id', 'password'],
} as const;

const publicUserSchema = omitProps(userSchema, ['password']);
type PublicUser = FromSchema<typeof publicUserSchema>;
// { id: string }
```

## Why?

Manipulating JSON Schemas directly can be verbose and error-prone.

This library provides small, focused utilities that keep runtime schemas and TypeScript types in sync — especially when paired with [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts).

## Installation

```
npm install @toomuchdesign/json-schema-fns
```

## API

[Try it live ⚡][playground] — every example below runs in the playground; open the file matching the function name.

| Function                                | Description                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| [`omitProps`](#omitProps)               | Omit specific `properties` from an object JSON schema                        |
| [`omitPropsDeep`](#omitPropsDeep)       | Omit specific nested `properties` using dot-notation paths                   |
| [`pickProps`](#pickProps)               | Pick only specific `properties` from an object JSON schema                   |
| [`pickPropsDeep`](#pickPropsDeep)       | Pick specific nested `properties` using dot-notation paths                   |
| [`mergeProps`](#mergeProps)             | Merge two object JSON schemas' `properties` and `patternProperties` into one |
| [`renameProps`](#renameProps)           | Rename specific `properties` via an `{ oldKey: newKey }` map                 |
| [`requireProps`](#requireProps)         | Mark specific properties as required (all if none provided)                  |
| [`optionalProps`](#optionalProps)       | Make specific properties optional (all if none provided)                     |
| [`sealSchemaDeep`](#sealSchemaDeep)     | Recursively set `additionalProperties: false` on all object schemas          |
| [`unsealSchemaDeep`](#unsealSchemaDeep) | Recursively remove `additionalProperties` and `unevaluatedProperties`        |

### omitProps

Omit specific `properties` from an object JSON schema.

```ts
import { omitProps } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'number' },
  },
  required: ['a', 'b'],
} as const;

const result = omitProps(schema, ['b']);
```

### omitPropsDeep

Omit specific nested `properties` from an object JSON schema using dot-notation paths. Paths sharing a common prefix are merged; a bare key drops the whole sub-schema, a dotted path drills in and drops only the leaf. When both forms target the same key, the bare-key drop wins.

```ts
import { omitPropsDeep } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  required: ['user', 'meta'],
  properties: {
    user: {
      type: 'object',
      required: ['id', 'password'],
      properties: {
        id: { type: 'string' },
        password: { type: 'string' },
      },
    },
    meta: { type: 'string' },
  },
} as const;

const result = omitPropsDeep(schema, ['user.password', 'meta']);
```

### pickProps

Pick only specific `properties` from an object JSON schema.

```ts
import { pickProps } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'number' },
  },
  required: ['a', 'b'],
} as const;

const result = pickProps(schema, ['b']);
```

### pickPropsDeep

Pick specific nested `properties` from an object JSON schema using dot-notation paths. Paths sharing a common prefix are merged; a bare key (without a sub-path) keeps the whole sub-schema unchanged.

```ts
import { pickPropsDeep } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  required: ['user', 'meta'],
  properties: {
    user: {
      type: 'object',
      required: ['id', 'password'],
      properties: {
        id: { type: 'string' },
        password: { type: 'string' },
      },
    },
    meta: { type: 'string' },
  },
} as const;

const result = pickPropsDeep(schema, ['user.id', 'meta']);
```

### mergeProps

Merge two object JSON schemas `properties` and `patternProperties` props into one. If the same property key exists in both schemas, the property from `schema2` takes precedence.

```ts
import { mergeProps } from '@toomuchdesign/json-schema-fns';

const schema1 = {
  type: 'object',
  properties: {
    a: { type: 'string' },
  },
  required: ['a'],
} as const;

const schema2 = {
  type: 'object',
  properties: {
    b: { type: 'number' },
  },
  required: ['b'],
} as const;

const result = mergeProps(schema1, schema2);
```

### renameProps

Rename specific properties in an object JSON schema via an `{ oldKey: newKey }` map. Source keys must exist in `schema.properties` (compile error on unknown keys); target keys are arbitrary strings. Position in `required` is preserved. Shallow only.

```ts
import { renameProps } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['id', 'email'],
} as const;

const result = renameProps(schema, { id: 'userId', email: 'emailAddress' });
```

### requireProps

Mark specific properties in a object JSON schema as required. If no keys provided, all properties become required.

```ts
import { requireProps } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
    c: { type: 'string' },
  },
  required: ['b'],
} as const;

const result = requireProps(schema, ['a', 'c']);
```

### optionalProps

Make specific properties of a object JSON schema optional. If no keys provided, all properties become optional.

```ts
import { optionalProps } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
    c: { type: 'string' },
  },
  required: ['a', 'b', 'c'],
} as const;

const result = optionalProps(schema, ['b', 'c']);
```

### sealSchemaDeep

Recursively set `additionalProperties: false` on all object JSON schema schemas.

It does not modify [JSON Schema combinators](https://json-schema.org/understanding-json-schema/reference/combining) such as `allOf`, `anyOf`, `oneOf`, or `not`. This ensures that the logical combination of schemas remains intact and that the semantics of the schema are not altered in any way.

```ts
import { sealSchemaDeep } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
      },
    },
  },
} as const;

const result = sealSchemaDeep(schema);
```

### unsealSchemaDeep

Recursively remove `additionalProperties` and `unevaluatedProperties` keywords from all object JSON schema schemas.

It does not modify [JSON Schema combinators](https://json-schema.org/understanding-json-schema/reference/combining) such as `allOf`, `anyOf`, `oneOf`, or `not`. This ensures that the logical combination of schemas remains intact and that the semantics of the schema are not altered in any way.

```ts
import { unsealSchemaDeep } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    name: { type: 'string' },
    address: {
      type: 'object',
      additionalProperties: false,
      properties: {
        street: { type: 'string' },
      },
    },
  },
} as const;

const result = unsealSchemaDeep(schema);
```

## Composition & pipe-friendly API (experimental)

In addition to the standard functional API, `json-schema-fns` also offers a composition-friendly counterpart that enables schema transformations through a pipeable interface. [Live demo ⚡][pipe-demo]

> Note: piping could lead TypeScript to hit its internal recursion limits producing the following error: `TS2589: Type instantiation is excessively deep and possibly infinite`

> Note: the library does not include its own pipe utility. You are free to use any composition library you prefer, such as [pipe-ts](https://www.npmjs.com/package/pipe-ts), [ts-functional-pipe](https://www.npmjs.com/package/ts-functional-pipe) or even bigger libraries like [effect](https://www.npmjs.com/package/effect) or [remeda](https://www.npmjs.com/package/remeda). See [composition tests](./test/composition.test.ts).

```ts
import {
  pipeMergeProps,
  pipeOmitProps,
  pipeRequireProps,
  pipeSealSchemaDeep,
} from '@toomuchdesign/json-schema-fns';
import { pipeWith } from 'pipe-ts';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
  },
  required: ['a'],
} as const;

const result = pipeWith(
  schema,
  pipeMergeProps({
    type: 'object',
    properties: {
      c: { type: 'string' },
    },
  }),
  pipeOmitProps(['a']),
  pipeRequireProps(['b']),
  pipeSealSchemaDeep(),
);
```

## Supported JSON Schema dialect

The library targets **[JSON Schema Draft-07 (2018)](https://json-schema.org/draft-07)**. Every transformation acts on a small known set of Draft-07 keywords (`type`, `properties`, `patternProperties`, `required`, `additionalProperties`, the combinators `allOf` / `anyOf` / `oneOf` / `not`, and the conditional applicators `if` / `then` / `else`).

**Forward-compatibility is a design property.** Schemas that use newer keywords from [Draft 2019-09](https://json-schema.org/draft/2019-09) or [Draft 2020-12](https://json-schema.org/draft/2020-12) — for example `$defs`, `prefixItems`, `dependentRequired`, `propertyNames`, `$dynamicRef` — pass through the library unchanged: every keyword the library does not explicitly transform rides through via TypeScript's `const` generic + `Omit`-based merge. See [docs/types.md](docs/types.md) for the mechanics.

## Related projects

- https://github.com/codeperate/json-schema-builder
- https://github.com/livelybone/union-tuple
- https://github.com/ksxnodemodules/typescript-tuple

## Todo

- Consider exposing a pipe utility

## Contributing

Contributions are welcome! Before opening a PR, please run:

```bash
npx changeset
```

[ci-badge]: https://github.com/toomuchdesign/json-schema-fns/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/json-schema-fns/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/json-schema-fns/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/json-schema-fns?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/json-schema-fns
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/json-schema-fns.svg
[playground]: https://stackblitz.com/edit/vitejs-vite-aglzxc19?file=src%2Findex.ts
[pipe-demo]: https://stackblitz.com/edit/vitejs-vite-aglzxc19?file=src%2Fpipe.ts
