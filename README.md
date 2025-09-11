# @toomuchdesign/json-schema-fns

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

`@toomuchdesign/json-schema-fns` is an utility library designed to manipulate JSON Schema objects in a fully type-safe manner. Its core goal is to ensure that transformations made to JSON Schemas not only update the schema structure correctly but also preserve accurate TypeScript type inference, particularly when used with tools like [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts).

To guarantee this alignment between runtime behavior and static types, each utility function is covered by both functional and type-level tests, ensuring the schema transformation matches the inferred TypeScript type exactly.

## Installation

```
npm install @toomuchdesign/json-schema-fns
```

## API

- [`omitObjectProperties`](#omitObjectProperties)
- [`pickObjectProperties`](#pickObjectProperties)
- [`mergeObjectProperties`](#mergeObjectProperties)
- [`requireObjectProperties`](#requireObjectProperties)
- [`closeObjectDeep`](#closeObjectDeep)
- [`openObjectDeep`](#openObjectDeep)

### omitObjectProperties

Remove specified properties from a JSON Schema object definition.

```ts
import { omitObjectProperties } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'number' },
  },
  required: ['a', 'b'],
} as const;

const result = omitObjectProperties(schema, ['b']);
```

### pickObjectProperties

Create a new object by picking the specified properties from a JSON Schema object definition.

```ts
import { pickObjectProperties } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'number' },
  },
  required: ['a', 'b'],
} as const;

const result = pickObjectProperties(schema, ['b']);
```

### mergeObjectProperties

Create a new object by picking the specified properties from a JSON Schema object definition.

```ts
import { mergeObjectProperties } from '@toomuchdesign/json-schema-fns';

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

const result = mergeObjectProperties(schema1, schema2);
```

### requireObjectProperties

Require all properties of a JSON Schema object definition.

```ts
import { requireObjectProperties } from '@toomuchdesign/json-schema-fns';

const schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
    c: { type: 'string' },
  },
  required: ['b'],
} as const;

const result = requireObjectProperties(schema);
```

### closeObjectDeep

Close object by recursively setting `additionalProperties` to false.

```ts
import { closeObjectDeep } from '@toomuchdesign/json-schema-fns';

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

const result = closeObjectDeep(schema);
```

### openObjectDeep

Open object by recursively removing `additionalProperties` props.

```ts
import { openObjectDeep } from '@toomuchdesign/json-schema-fns';

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

const result = openObjectDeep(schema);
```

## Similar packages

- https://github.com/codeperate/json-schema-builder

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

[ci-badge]: https://github.com/toomuchdesign/json-schema-fns/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/json-schema-fns/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/json-schema-fns/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/json-schema-fns?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/json-schema-fns
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/json-schema-fns.svg
