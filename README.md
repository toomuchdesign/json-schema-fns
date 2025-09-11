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

- [`omitProps`](#omitProps) – Omit specific properties from an object schema
- [`pickProps`](#pickProps) – Pick only specific properties from an object schema
- [`mergeProps`](#mergeProps) – Merge two object schemas into one
- [`requireProps`](#requireProps) – Mark all properties in an object schema as required
- [`sealSchema`](#sealSchema) – Recursively set `additionalProperties: false` on all object schemas
- [`unsealSchema`](#unsealSchema) – Recursively remove `additionalProperties` from all object schemas

### omitProps

Omit specific properties from an object schema.

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

Pick only specific properties from an object schema.

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

Merge two object schemas into one.

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

Mark all properties in an object schema as required.

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

const result = requireProps(schema);
```

### sealSchema

Recursively set `additionalProperties: false` on all object schemas.

```ts
import { sealSchema } from '@toomuchdesign/json-schema-fns';

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

const result = sealSchema(schema);
```

### unsealSchema

Recursively remove `additionalProperties` from all object schemas.

```ts
import { unsealSchema } from '@toomuchdesign/json-schema-fns';

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

const result = unsealSchema(schema);
```

## Similar packages

- https://github.com/codeperate/json-schema-builder

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
