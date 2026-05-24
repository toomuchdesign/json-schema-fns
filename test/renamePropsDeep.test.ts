import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeRenamePropsDeep, renamePropsDeep } from '../src';
import { assertValidSchema } from './assertValidSchema';

describe('renamePropsDeep', () => {
  describe('single nested path', () => {
    it('renames the leaf property and updates nested required', () => {
      const schema = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'object',
            required: ['x', 'y'],
            properties: {
              x: { type: 'string' },
              y: { type: 'number' },
            },
          },
          b: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, { 'a.x': 'xRenamed' });
      const expected = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'object',
            required: ['xRenamed', 'y'],
            properties: {
              xRenamed: { type: 'string' },
              y: { type: 'number' },
            },
          },
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('bare top-level rename only', () => {
    it('matches shallow renameProps behavior', () => {
      const schema = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, { a: 'alpha' });
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

  describe('multiple sibling paths under the same prefix', () => {
    it('renames each of them within the parent', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['x', 'y', 'z'],
            properties: {
              x: { type: 'string' },
              y: { type: 'number' },
              z: { type: 'boolean' },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, {
        'a.x': 'xRenamed',
        'a.y': 'yRenamed',
      });
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['xRenamed', 'yRenamed', 'z'],
            properties: {
              xRenamed: { type: 'string' },
              yRenamed: { type: 'number' },
              z: { type: 'boolean' },
            },
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('top-level and nested renames combined', () => {
    it('renames both at their respective levels', () => {
      const schema = {
        type: 'object',
        required: ['user', 'meta'],
        properties: {
          user: {
            type: 'object',
            required: ['id', 'email'],
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
            },
          },
          meta: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, {
        user: 'account',
        'user.id': 'userId',
        meta: 'metadata',
      });
      const expected = {
        type: 'object',
        required: ['account', 'metadata'],
        properties: {
          account: {
            type: 'object',
            required: ['userId', 'email'],
            properties: {
              userId: { type: 'string' },
              email: { type: 'string' },
            },
          },
          metadata: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('deeply nested path', () => {
    it('renames the leaf at depth 3', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['b'],
            properties: {
              b: {
                type: 'object',
                required: ['c'],
                properties: {
                  c: { type: 'string' },
                },
              },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, { 'a.b.c': 'cRenamed' });
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['b'],
            properties: {
              b: {
                type: 'object',
                required: ['cRenamed'],
                properties: {
                  cRenamed: { type: 'string' },
                },
              },
            },
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('property not in required', () => {
    it('renames the property without adding it to required', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['x'],
            properties: {
              x: { type: 'string' },
              y: { type: 'number' },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, { 'a.y': 'yRenamed' });
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['x'],
            properties: {
              x: { type: 'string' },
              yRenamed: { type: 'number' },
            },
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('no-op on empty renames map', () => {
    it('returns an equivalent schema', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['x'],
            properties: {
              x: { type: 'string' },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, {});
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            required: ['x'],
            properties: {
              x: { type: 'string' },
            },
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('preserves non-relevant siblings', () => {
    it('keeps patternProperties and extraneous props untouched', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              x: { type: 'string' },
            },
          },
        },
        patternProperties: {
          '^S_': { type: 'string' },
        },
        extraneousProp: { hello: 'world' },
      } as const;
      deepFreeze(schema);

      const actual = renamePropsDeep(schema, { 'a.x': 'xRenamed' });
      const expected = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              xRenamed: { type: 'string' },
            },
          },
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
        renamePropsDeep(schema, { a: 'alpha' }),
      ).toThrow('Schema is expected to have a "type" property set to "object"');
    });
  });

  describe('unknown source path', () => {
    it('rejects at the type level', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              x: { type: 'string' },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      // @ts-expect-error intentionally testing a scenario not allowed by types
      renamePropsDeep(schema, { 'a.nope': 'x' });
    });
  });
});

describe('pipeRenamePropsDeep', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      required: ['a'],
      properties: {
        a: {
          type: 'object',
          required: ['x'],
          properties: {
            x: { type: 'string' },
            y: { type: 'number' },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = pipeWith(schema, pipeRenamePropsDeep({ 'a.x': 'xRenamed' }));
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: {
          type: 'object',
          required: ['xRenamed'],
          properties: {
            xRenamed: { type: 'string' },
            y: { type: 'number' },
          },
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });
});
