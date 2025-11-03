import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeUnsealSchemaDeep, unsealSchemaDeep } from '../src';

describe('unsealSchemaDeep', () => {
  it('recursively removes additionalProperties and unevaluatedProperties props', () => {
    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        },
        b: {
          type: 'object',
          additionalProperties: true,
          properties: {
            b: { type: 'string' },
          },
        },
        c: {
          type: 'object',
          additionalProperties: false,
          properties: {
            c: { type: 'string' },
          },
        },
        d: {
          type: 'object',
          unevaluatedProperties: true,
          properties: {
            d: { type: 'string' },
          },
        },
        e: {
          type: 'object',
          unevaluatedProperties: false,
          properties: {
            e: { type: 'string' },
          },
        },
      },
      patternProperties: {
        z: {
          type: 'object',
          additionalProperties: false,
          properties: {
            z: { type: 'string' },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = unsealSchemaDeep(schema);
    const expected = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        },
        b: {
          type: 'object',
          properties: {
            b: { type: 'string' },
          },
        },
        c: {
          type: 'object',
          properties: {
            c: { type: 'string' },
          },
        },
        d: {
          type: 'object',
          properties: {
            d: { type: 'string' },
          },
        },
        e: {
          type: 'object',
          properties: {
            e: { type: 'string' },
          },
        },
      },
      patternProperties: {
        z: {
          type: 'object',
          properties: {
            z: { type: 'string' },
          },
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('array prop', () => {
    it('recursively removes additionalProperties props', () => {
      const schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
          level_1: {
            type: 'array',
            items: [
              {
                type: 'string',
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  level_2: { type: 'string' },
                },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  level_2: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      level_3: {
                        type: 'array',
                        items: [
                          {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              level_4: { type: 'string' },
                            },
                          },
                          {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              level_4: { type: 'string' },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = unsealSchemaDeep(schema);
      const expected = {
        type: 'object',
        properties: {
          level_1: {
            type: 'array',
            items: [
              {
                type: 'string',
              },
              {
                type: 'object',
                properties: {
                  level_2: { type: 'string' },
                },
              },
              {
                type: 'object',
                properties: {
                  level_2: {
                    type: 'object',
                    properties: {
                      level_3: {
                        type: 'array',
                        items: [
                          {
                            type: 'object',
                            properties: {
                              level_4: { type: 'string' },
                            },
                          },
                          {
                            type: 'object',
                            properties: {
                              level_4: { type: 'string' },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('JSON Schema object with additionalProperties prop name', () => {
    it('does not change object properties', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              additionalProperties: {
                // This object should not be touched no matter the prop name
                type: 'boolean',
              },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = unsealSchemaDeep(schema);
      const expected = schema;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});

describe('pipeUnsealSchemaDeep', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        },
        b: {
          type: 'object',
          additionalProperties: true,
          properties: {
            b: { type: 'string' },
          },
        },
        c: {
          type: 'object',
          additionalProperties: false,
          properties: {
            c: { type: 'string' },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = pipeWith(schema, pipeUnsealSchemaDeep());
    const expected = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        },
        b: {
          type: 'object',
          properties: {
            b: { type: 'string' },
          },
        },
        c: {
          type: 'object',
          properties: {
            c: { type: 'string' },
          },
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });
});
