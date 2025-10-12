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
    } as const;

    expect(actual).toEqual(expected);
    expectTypeOf(actual).toEqualTypeOf(expected);
  });

  describe('array prop', () => {
    it('recursively set additionalProperties prop to false', () => {
      const schema = {
        type: 'object',
        properties: {
          level_1: {
            oneOf: [
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
                        oneOf: [
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
      deepFreeze(schema);

      const actual = sealSchemaDeep(schema);
      const expected = {
        type: 'object',
        additionalProperties: false,
        properties: {
          level_1: {
            oneOf: [
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
                        oneOf: [
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
