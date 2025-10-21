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

- [`omitProps`](#omitProps) – Omit specific `properties` from an object JSON schema
- [`pickProps`](#pickProps) – Pick only specific `properties` from an object JSON schema
- [`mergeProps`](#mergeProps) – Merge two object JSON schemas `properties` and `patternProperties` props into one. If the same property key exists in both schemas, the property from `schema2` takes precedence
- [`requireProps`](#requireProps) – Mark specific properties in a object JSON schema as required. If no keys provided, all properties become required
- [`optionalProps`](#optionalProps) – Make specific properties of a object JSON schema optional. If no keys provided, all properties become optional
- [`sealSchemaDeep`](#sealSchemaDeep) – Recursively set `additionalProperties: false` on all object JSON schema schemas
- [`unsealSchemaDeep`](#unsealSchemaDeep) – Recursively remove `additionalProperties` from all object JSON schema schemas

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

Recursively remove `additionalProperties` from all object JSON schema schemas.

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

## Composition & pipe-friendly API

In addition to the standard functional API, `json-schema-fns` also offers a composition-friendly counterpart that enables schema transformations through a pipeable interface.

> Note: The library does not include its own pipe utility. You are free to use any composition library you prefer, such as [pipe-ts](https://www.npmjs.com/package/pipe-ts), [ts-functional-pipe](https://www.npmjs.com/package/ts-functional-pipe) or even bigger libraries like [effect](https://www.npmjs.com/package/effect) or [remeda](https://www.npmjs.com/package/remeda). See [composition tests](./test/composition.test.ts).

### Functional API Example

```ts
import {
  mergeProps,
  omitProps,
  requireProps,
  sealSchemaDeep,
} from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
  },
  required: ['a'],
} as const;

const result = sealSchemaDeep(
  requireProps(
    omitProps(
      mergeProps(schema, {
        type: 'object',
        properties: {
          c: { type: 'string' },
        },
      }),
      ['a'],
    ),
    ['b'],
  ),
);
```

### Pipeable API Example

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

## Related projects

- https://github.com/codeperate/json-schema-builder
- https://github.com/livelybone/union-tuple
- https://github.com/ksxnodemodules/typescript-tuple

## Todo

- Replace `type-fest`'s `UnionToTuple` type
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
