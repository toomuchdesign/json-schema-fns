import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { optionalProps, pipeOptionalProps } from '../src';

describe('optionalProps', () => {
  describe('without keys argument', () => {
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

    describe('provided schema.properties prop is empty object', () => {
      it('removes required field', () => {
        const schema = {
          type: 'object',
          properties: {},
          required: ['a', 'b'],
        } as const;
        deepFreeze(schema);

        const actual = optionalProps(schema);
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

    describe('keys argument is empty array []', () => {
      it('returns schema as is', () => {
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

    describe('missing provided schema.required field', () => {
      it('returns schema as is', () => {
        const schema = {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        } as const;
        deepFreeze(schema);

        const actual = optionalProps(schema, ['a']);
        const expected = schema;

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
        optionalProps(schema, ['a']),
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
        optionalProps(schema, ['a']),
      ).toThrow('Schema is expected to have a "properties" property');
    });
  });
});

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

    const actual = pipeWith(schema, pipeOptionalProps(['b', 'd']));
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
});
