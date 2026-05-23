import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeRenameProps, renameProps } from '../src';
import { assertValidSchema } from './assertValidSchema';

describe('renameProps', () => {
  it('renames a property and updates required position', () => {
    const schema = {
      type: 'object',
      required: ['a', 'b', 'c'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, { b: 'beta' });
    const expected = {
      type: 'object',
      required: ['a', 'beta', 'c'],
      properties: {
        a: { type: 'string' },
        beta: { type: 'number' },
        c: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('renames multiple properties at once', () => {
    const schema = {
      type: 'object',
      required: ['id', 'email'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, {
      id: 'userId',
      email: 'emailAddress',
    });
    const expected = {
      type: 'object',
      required: ['userId', 'emailAddress'],
      properties: {
        userId: { type: 'string' },
        emailAddress: { type: 'string' },
        name: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('no-ops on empty renames map', () => {
    const schema = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, {});
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('renames a property that is not in required', () => {
    const schema = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, { b: 'beta' });
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: { type: 'string' },
        beta: { type: 'number' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('preserves non relevant props', () => {
    const schema = {
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, { a: 'alpha' });
    const expected = {
      type: 'object',
      properties: {
        alpha: { type: 'string' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('no required prop on resulting schema when source has none', () => {
    const schema = {
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = renameProps(schema, { a: 'alpha' });
    const expected = {
      type: 'object',
      properties: {
        alpha: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  describe('root type !== object', () => {
    it('throws expected error', () => {
      const schema = {
        type: 'array',
        properties: {
          a: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      expect(() =>
        // @ts-expect-error intentionally testing a scenario not allowed by types
        renameProps(schema, { a: 'alpha' }),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });

  describe('unknown source key', () => {
    it('rejects at the type level', () => {
      const schema = {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      // @ts-expect-error intentionally testing a scenario not allowed by types
      renameProps(schema, { nope: 'x' });
    });
  });
});

describe('pipeRenameProps', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      },
    } as const;
    deepFreeze(schema);

    const actual = pipeWith(schema, pipeRenameProps({ a: 'alpha' }));
    const expected = {
      type: 'object',
      required: ['alpha', 'b'],
      properties: {
        alpha: { type: 'string' },
        b: { type: 'number' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });
});
