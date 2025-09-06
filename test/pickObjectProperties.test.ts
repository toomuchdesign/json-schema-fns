import { describe, it, expect } from 'vitest';
import { expectTypeOf } from 'expect-type';
import deepFreeze from 'deep-freeze';
import { pickObjectProperties } from '../src';

describe('pickObjectProperties', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'string' },
        d: { type: 'number' },
      },
    } as const;
    deepFreeze(schema);

    const actual = pickObjectProperties(schema, ['a', 'd']);
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
        d: { type: 'number' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  it('preserves non relevant props', () => {
    const schema = {
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;
    deepFreeze(schema);

    const actual = pickObjectProperties(schema, ['a']);
    const expected = {
      type: 'object',
      required: undefined,
      properties: {
        a: { type: 'string' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('all required props removed', () => {
    it('returns undefined required', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
          c: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = pickObjectProperties(schema, ['c']);
      const expected = {
        type: 'object',
        required: undefined,
        properties: {
          c: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('type !== object', () => {
    it('returns schema as is', () => {
      const schema = {
        type: 'array',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      // @ts-expect-error intentionally testing a scenario not allowed by types
      const actual = pickObjectProperties(schema, ['a']);
      const expected = actual;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});
