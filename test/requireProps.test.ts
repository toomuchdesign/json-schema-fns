import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { Merge } from 'type-fest';
import { describe, expect, it } from 'vitest';

import { requireProps } from '../src';

describe('requireProps', () => {
  it('recursively set additionalProperties prop to false', () => {
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

  describe('provided schema.properties prop', () => {
    describe('no schema properties', () => {
      it("doesn't add empty required prop", () => {
        const schema = {
          type: 'object',
        } as const;
        deepFreeze(schema);

        const actual = requireProps(schema);
        const expected = {
          type: 'object',
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });

    describe('schema properties is empty object', () => {
      it("doesn't add empty required prop", () => {
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
});
