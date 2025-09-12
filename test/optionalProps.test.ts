import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { optionalProps } from '../src';

describe('optionalProps', () => {
  it('remove given keys from required field', () => {
    const schema = {
      type: 'object',
      required: ['a', 'b', 'c', 'd'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'number' },
        d: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = optionalProps(schema, ['b', 'd']);
    const expected = {
      type: 'object',
      required: ['a', 'c'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'number' },
        d: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('no keys provided', () => {
    it('removes required field', () => {
      const schema = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema);

      const actual = optionalProps(schema);
      const expected = {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('keys as empty array []', () => {
    it('keeps schema as is', () => {
      const schema = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema);

      const actual = optionalProps(schema, []);
      const expected = schema;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('type !== object', () => {
    it('throws expected error', () => {
      const schema = {
        type: 'array',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      expect(() =>
        // @ts-expect-error intentionally testing a scenario not allowed by types
        optionalProps(schema, ['a']),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });
});
