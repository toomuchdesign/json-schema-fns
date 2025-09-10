import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { openObjectDeep } from '../src';

describe('openObjectDeep', () => {
  it('recursively removes additionalProperties props', () => {
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

    const actual = openObjectDeep(schema);
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

  describe('array prop', () => {
    it('recursively removes additionalProperties props', () => {
      const schema = {
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
      deepFreeze(schema);

      const actual = openObjectDeep(schema);
      const expected = {
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

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('JSON Schema object with additionalProperties prop', () => {
    it('does not affect object properties', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              additionalProperties: { type: 'boolean' },
            },
          },
        },
      } as const;
      deepFreeze(schema);

      const actual = openObjectDeep(schema);
      const expected = schema;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });
});
