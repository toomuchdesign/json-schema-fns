import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { Merge, TupleToUnion } from 'type-fest';
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

      expect(actual).toEqual(expected);

      /**
       * Need to test required prop type separately as an union instead of original tuple
       * since TypeScript doesn't guarantee object key sorting
       */
      type Actual = typeof actual;
      type Expected = typeof expected;
      expectTypeOf<Omit<Actual, 'required'>>(actual).toEqualTypeOf<
        Omit<Expected, 'required'>
      >();

      type ActualRequired = TupleToUnion<Actual['required']>;
      type ExpectedRequired = TupleToUnion<Expected['required']>;
      expectTypeOf<ActualRequired>().toEqualTypeOf<ExpectedRequired>();
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

      /**
       * Need to test required prop type separately as an union instead of original tuple
       * since TypeScript doesn't guarantee object key sorting
       */
      type Actual = typeof actual;
      type Expected = typeof expected;
      expectTypeOf<Omit<Actual, 'required'>>(actual).toEqualTypeOf<
        Omit<Expected, 'required'>
      >();

      type ActualRequired = TupleToUnion<Actual['required']>;
      type ExpectedRequired = TupleToUnion<Expected['required']>;
      expectTypeOf<ActualRequired>().toEqualTypeOf<ExpectedRequired>();
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
