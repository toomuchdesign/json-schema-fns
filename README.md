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
