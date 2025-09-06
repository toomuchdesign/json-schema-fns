import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { mergeObjectProperties } from '../src';

describe('mergeObjectProperties', () => {
  it('returns expected schema and types', () => {
    const schema1 = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      },
      patternProperties: {
        a: {
          type: 'string',
        },
      },
    } as const;

    const schema2 = {
      type: 'object',
      required: ['d'],
      properties: {
        c: { type: 'string' },
        d: { type: 'number' },
      },
      patternProperties: {
        b: {
          type: 'number',
        },
      },
    } as const;
    deepFreeze(schema1);
    deepFreeze(schema2);

    const actual = mergeObjectProperties(schema1, schema2);
    const expected = {
      type: 'object',
      required: ['a', 'd'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'string' },
        d: { type: 'number' },
      },
      patternProperties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'number',
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('clashing input properties', () => {
    it('dedupes required field and gives precedence to schema2', () => {
      const schema1 = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const schema2 = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'number' },
        },
      } as const;
      deepFreeze(schema1);
      deepFreeze(schema2);

      const actual = mergeObjectProperties(schema1, schema2);
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'number' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  it('preserves non relevant props giving precedence to schema2', () => {
    const schema1 = {
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
      extraneousProp1: { hello: 'world' },
      clashingProp: { hello: 'schema1' },
    } as const;

    const schema2 = {
      type: 'object',
      properties: {
        b: { type: 'number' },
      },
      extraneousProp2: { hello: 'world' },
      clashingProp: { hello: 'schema2' },
    } as const;
    deepFreeze(schema1);
    deepFreeze(schema2);

    const actual = mergeObjectProperties(schema1, schema2);
    const expected = {
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      },
      extraneousProp1: { hello: 'world' },
      extraneousProp2: { hello: 'world' },
      clashingProp: { hello: 'schema2' },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('no required props on resulting schema', () => {
    it('returns undefined required', () => {
      const schema1 = {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const schema2 = {
        type: 'object',
        properties: {
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema1);
      deepFreeze(schema2);

      const actual = mergeObjectProperties(schema1, schema2);
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

  it('dedupes', () => {
    const schema1 = {
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
    } as const;

    const schema2 = {
      type: 'object',
      properties: {
        b: { type: 'number' },
      },
    } as const;
    deepFreeze(schema1);
    deepFreeze(schema2);

    const actual = mergeObjectProperties(schema1, schema2);
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

  describe('type !== object', () => {
    it('throws expected error', () => {
      const schema1 = {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const schema2 = {
        properties: {
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema1);
      deepFreeze(schema2);

      expect(() =>
        // @ts-expect-error intentionally testing a scenario not allowed by types
        mergeObjectProperties(schema1, schema2),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });
});
