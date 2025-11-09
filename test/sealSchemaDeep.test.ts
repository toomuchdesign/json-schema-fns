import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeSealSchemaDeep, sealSchemaDeep } from '../src';

describe('sealSchemaDeep', () => {
  it('recursively set additionalProperties prop to false', () => {
    const schema = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
          },
        },
      },
      patternProperties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = sealSchemaDeep(schema);
    const expected = {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          additionalProperties: false,
          properties: {
            street: { type: 'string' },
          },
        },
      },
      patternProperties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          additionalProperties: false,
          properties: {
            street: { type: 'string' },
          },
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('array prop', () => {
    it('ignores combinator schemas', () => {
      const schema = {
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
                    type: 'array',
                    items: [
                      {
                        type: 'object',
                        properties: {
                          level_3: { type: 'string' },
                        },
                      },
                      {
                        type: 'object',
                        properties: {
                          level_3: { type: 'string' },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = sealSchemaDeep(schema);
      const expected = {
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
                    type: 'array',
                    items: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          level_3: { type: 'string' },
                        },
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          level_3: { type: 'string' },
                        },
                      },
                    ],
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
                // This object should not be changed no matter the prop name
                type: 'boolean',
              },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = sealSchemaDeep(schema);
      const expected = {
        type: 'object',
        additionalProperties: false,
        properties: {
          a: {
            type: 'object',
            additionalProperties: false,
            properties: {
              additionalProperties: { type: 'boolean' },
            },
          },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});

describe('pipeSealSchemaDeep', () => {
  it('returns expected schema and types', () => {
    const schema = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
          },
        },
      },
    } as const;
    deepFreeze(schema);

    const actual = pipeWith(schema, pipeSealSchemaDeep());
    const expected = {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          additionalProperties: false,
          properties: {
            street: { type: 'string' },
          },
        },
      },
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });
});
