import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { omitPropsDeep, pipeOmitPropsDeep } from '../src';
import { assertValidSchema } from './assertValidSchema';

describe('omitPropsDeep', () => {
  it('deep omits a single nested property', () => {
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

    const actual = omitPropsDeep(schema, ['a.x']);
    const expected = {
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: {
          type: 'object',
          required: ['y'],
          properties: {
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

  it('merges sibling paths under the same prefix', () => {
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

    const actual = omitPropsDeep(schema, ['a.x', 'a.y']);
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: {
          type: 'object',
          required: ['z'],
          properties: {
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

  it('combines top-level and nested paths', () => {
    const schema = {
      type: 'object',
      required: ['a', 'b', 'c', 'd'],
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
        b: { type: 'string' },
        c: { type: 'number' },
        d: { type: 'boolean' },
      },
    } as const;
    deepFreeze(schema);

    const actual = omitPropsDeep(schema, ['a.x', 'a.y', 'b', 'c']);
    const expected = {
      type: 'object',
      required: ['a', 'd'],
      properties: {
        a: {
          type: 'object',
          required: ['z'],
          properties: {
            z: { type: 'boolean' },
          },
        },
        d: { type: 'boolean' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('omits the whole sub-schema when a bare key is supplied', () => {
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

    const actual = omitPropsDeep(schema, ['a']);
    const expected = {
      type: 'object',
      required: ['b'],
      properties: {
        b: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('drills through multiple levels of nesting', () => {
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
              required: ['c', 'd'],
              properties: {
                c: { type: 'string' },
                d: { type: 'number' },
              },
            },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = omitPropsDeep(schema, ['a.b.c']);
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
              required: ['d'],
              properties: {
                d: { type: 'number' },
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

  it('drills 4 levels deep and prunes a single leaf at every level', () => {
    const schema = {
      type: 'object',
      required: ['a', 'keep'],
      properties: {
        a: {
          type: 'object',
          required: ['b', 'sibling1'],
          properties: {
            b: {
              type: 'object',
              required: ['c', 'sibling2'],
              properties: {
                c: {
                  type: 'object',
                  required: ['d', 'sibling3'],
                  properties: {
                    d: { type: 'string' },
                    sibling3: { type: 'boolean' },
                  },
                },
                sibling2: { type: 'number' },
              },
            },
            sibling1: { type: 'string' },
          },
        },
        keep: { type: 'string' },
      },
    } as const;
    deepFreeze(schema);

    const actual = omitPropsDeep(schema, ['a.b.c.d']);
    const expected = {
      type: 'object',
      required: ['a', 'keep'],
      properties: {
        a: {
          type: 'object',
          required: ['b', 'sibling1'],
          properties: {
            b: {
              type: 'object',
              required: ['c', 'sibling2'],
              properties: {
                c: {
                  type: 'object',
                  required: ['sibling3'],
                  properties: {
                    sibling3: { type: 'boolean' },
                  },
                },
                sibling2: { type: 'number' },
              },
            },
            sibling1: { type: 'string' },
          },
        },
        keep: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('drills 5 levels deep and merges sibling paths at a deep level', () => {
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
                c: {
                  type: 'object',
                  required: ['d'],
                  properties: {
                    d: {
                      type: 'object',
                      required: ['e', 'f', 'g'],
                      properties: {
                        e: { type: 'string' },
                        f: { type: 'number' },
                        g: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = omitPropsDeep(schema, ['a.b.c.d.e', 'a.b.c.d.g']);
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
              required: ['c'],
              properties: {
                c: {
                  type: 'object',
                  required: ['d'],
                  properties: {
                    d: {
                      type: 'object',
                      required: ['f'],
                      properties: {
                        f: { type: 'number' },
                      },
                    },
                  },
                },
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

  it('whole-wins at the top level', () => {
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

    // bare 'a' wins over 'a.x' — the whole sub-schema is dropped
    const actual = omitPropsDeep(schema, ['a', 'a.x']);
    const expected = {
      type: 'object',
      required: ['b'],
      properties: {
        b: { type: 'string' },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
    assertValidSchema(actual);
    assertValidSchema(expected);
  });

  it('duplicate paths are treated as a single path', () => {
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

    const actual = omitPropsDeep(schema, ['a.x', 'a.x']);
    const expected = {
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: {
          type: 'object',
          required: ['y'],
          properties: {
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

  it('whole-wins at a deep nested level', () => {
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
              required: ['c', 'sibling'],
              properties: {
                c: {
                  type: 'object',
                  required: ['x', 'y'],
                  properties: {
                    x: { type: 'string' },
                    y: { type: 'number' },
                  },
                },
                sibling: { type: 'boolean' },
              },
            },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    // 'a.b.c' wins over 'a.b.c.x' — c is dropped whole
    const actual = omitPropsDeep(schema, ['a.b.c', 'a.b.c.x']);
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
              required: ['sibling'],
              properties: {
                sibling: { type: 'boolean' },
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

  it('preserves non relevant props at every level', () => {
    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            x: { type: 'string' },
            y: { type: 'number' },
          },
          patternProperties: {
            '^N_': { type: 'number' },
          },
          extraneousNested: { hello: 'nested' },
        },
        b: { type: 'number' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
      },
      extraneousProp: { hello: 'world' },
    } as const;
    deepFreeze(schema);

    const actual = omitPropsDeep(schema, ['a.x']);
    const expected = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            y: { type: 'number' },
          },
          patternProperties: {
            '^N_': { type: 'number' },
          },
          extraneousNested: { hello: 'nested' },
        },
        b: { type: 'number' },
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

  describe('no required props on resulting schema', () => {
    it('omits required prop at the nested level', () => {
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

      const actual = omitPropsDeep(schema, ['a.x']);
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: {
            type: 'object',
            properties: {
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

    it('omits required prop at the root level', () => {
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
          b: { type: 'string' },
        },
      } as const;
      deepFreeze(schema);

      const actual = omitPropsDeep(schema, ['a']);
      const expected = {
        type: 'object',
        properties: {
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('empty paths', () => {
    it('returns the schema unchanged', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;
      deepFreeze(schema);

      const actual = omitPropsDeep(schema, []);
      const expected = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
    });
  });

  describe('combinators (out of scope)', () => {
    it('preserves root-level and nested combinators verbatim', () => {
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
            allOf: [{ type: 'object' }],
          },
          b: { type: 'string' },
        },
        anyOf: [{ type: 'object' }],
        oneOf: [{ type: 'object' }],
        not: { type: 'object' },
      } as const;
      deepFreeze(schema);

      const actual = omitPropsDeep(schema, ['a.x']);
      const expected = {
        type: 'object',
        required: ['a', 'b'],
        properties: {
          a: {
            type: 'object',
            required: ['y'],
            properties: {
              y: { type: 'number' },
            },
            allOf: [{ type: 'object' }],
          },
          b: { type: 'string' },
        },
        anyOf: [{ type: 'object' }],
        oneOf: [{ type: 'object' }],
        not: { type: 'object' },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
      assertValidSchema(actual);
      assertValidSchema(expected);
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
        omitPropsDeep(schema, ['a']),
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
        omitPropsDeep(schema, ['a']),
      ).toThrow('Schema is expected to have a "properties" property');
    });
  });
});

describe('pipeOmitPropsDeep', () => {
  it('returns expected schema and types', () => {
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

    const actual = pipeWith(schema, pipeOmitPropsDeep(['a.x', 'b']));
    const expected = {
      type: 'object',
      required: ['a'],
      properties: {
        a: {
          type: 'object',
          required: ['y'],
          properties: {
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
