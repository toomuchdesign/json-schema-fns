import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { Merge } from 'type-fest';
import { describe, expect, it } from 'vitest';

import { requireProps } from '../src';

describe('requireProps', () => {
  describe('without keys argument', () => {
    it('sets all properties as required', () => {
      const schema = {
        type: 'object',
        required: ['a', 'd'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
          },
          d: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = requireProps(schema);
      const expected = {
        type: 'object',
        required: ['a', 'b', 'c', 'd'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
          },
          d: { type: 'string' },
        },
      } as const;

      // keyof conversion doesn't preserve key order
      type ExpectedType = Merge<
        typeof expected,
        Readonly<{
          required: readonly ['a', 'd', 'b', 'c'];
        }>
      >;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf<ExpectedType>();
    });

    describe('provided schema.properties prop is empty object', () => {
      it('omits required prop', () => {
        const schema = {
          type: 'object',
          properties: {},
        } as const;
        deepFreeze(schema);

        const actual = requireProps(schema);
        const expected = {
          type: 'object',
          properties: {},
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });
  });

  describe('with keys argument', () => {
    it('sets provided keys as required', () => {
      const schema = {
        type: 'object',
        required: ['b'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
          },
          d: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = requireProps(schema, ['a', 'd']);
      const expected = {
        type: 'object',
        required: ['b', 'a', 'd'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
          },
          d: { type: 'string' },
        },
      } as const;

      // keyof conversion doesn't preserve key order
      type ExpectedType = Merge<
        typeof expected,
        Readonly<{
          required: readonly ['a', 'd', 'b'];
        }>
      >;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf<ExpectedType>();
    });

    describe('missing provided schema.required field', () => {
      it('adds required property accordingly', () => {
        const schema = {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        } as const;
        deepFreeze(schema);

        const actual = requireProps(schema, ['a']);
        const expected = {
          type: 'object',
          required: ['a'],
          properties: {
            a: { type: 'string' },
          },
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });
  });

  it('dedupes required field', () => {
    const schema = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = requireProps(schema, ['a']);
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
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
        requireProps(schema, ['a']),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });

  describe('missing properties prop', () => {
    it('throws expected error', () => {
      const schema = {
        type: 'object',
        required: ['a'],
      } as const;
      deepFreeze(schema);

      expect(() =>
        // @ts-expect-error intentionally testing a scenario not allowed by types
        requireProps(schema, ['a']),
      ).toThrow('Schema is expected to have a "properties" property');
    });
  });
});
