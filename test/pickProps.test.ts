import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { pickProps } from '../src';

describe('pickProps', () => {
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

    const actual = pickProps(schema, ['a', 'd']);
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

    const actual = pickProps(schema, ['a']);
    const expected = {
      type: 'object',
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

  describe('no required props on resulting schema', () => {
    it('omits required prop', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
          c: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = pickProps(schema, ['c']);

      const expected = {
        type: 'object',
        properties: {
          c: { type: 'string' },
        },
      } as const;

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
        pickProps(schema, ['a']),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });
});
