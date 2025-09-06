import { describe, it, expect } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { omitObjectProperties } from '../src';

describe('omitObjectProperties', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      required: ['name', 'age', 'email'],
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string' },
      },
    } as const;

    const actual = omitObjectProperties(schema, ['email']);
    const expected = {
      type: 'object',
      required: ['name', 'age'],
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  it('preserves non relevant props', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;

    const actual = omitObjectProperties(schema, ['name']);
    const expected = {
      type: 'object',
      required: undefined,
      properties: {},
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
        required: ['name'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
        },
      } as const;

      const actual = omitObjectProperties(schema, ['name']);
      const expected = {
        type: 'object',
        required: undefined,
        properties: {
          email: { type: 'string' },
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
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      } as const;

      // @ts-expect-error intentionally testing a scenario not allowed by types
      const actual = omitObjectProperties(schema, ['name']);
      const expected = actual;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});
