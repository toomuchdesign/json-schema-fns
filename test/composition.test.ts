import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { mergeProps, omitProps, requireProps, sealSchemaDeep } from '../src';

describe('composition', () => {
  describe('nested function calls', () => {
    it('returns expected schema and types', () => {
      const schema1 = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const schema2 = {
        type: 'object',
        properties: {
          b: { type: 'string' },
        },
      } as const;

      const actual = sealSchemaDeep(
        requireProps(omitProps(mergeProps(schema1, schema2), ['a']), ['b']),
      );

      const expected = {
        type: 'object',
        required: ['b'],
        additionalProperties: false,
        properties: {
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('pipe-ts piping library', () => {
    it('returns expected schema and types', () => {
      const schema1 = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const schema2 = {
        type: 'object',
        properties: {
          b: { type: 'string' },
        },
      } as const;

      const actual = pipeWith(
        schema1,
        (result) => mergeProps(result, schema2),
        (result) => omitProps(result, ['a']),
        (result) => requireProps(result, ['b']),
        (result) => sealSchemaDeep(result),
      );

      const expected = {
        type: 'object',
        required: ['b'],
        additionalProperties: false,
        properties: {
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});
