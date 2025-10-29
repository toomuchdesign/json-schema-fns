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

  describe('combinators', () => {
    describe('allOf', () => {
      it('ignores combinator schemas', () => {});
      const schema = {
        type: 'object',
        properties: {
          allOfProperty: {
            allOf: [
              {
                type: 'object',
                properties: {
                  a: {
                    type: 'object',
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  b: {
                    type: 'object',
                    properties: {
                      bb: { type: 'number' },
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
          allOfProperty: {
            allOf: [
              {
                type: 'object',
                properties: {
                  a: {
                    type: 'object',
                    // additionalProperties: false,
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  b: {
                    type: 'object',
                    // additionalProperties: false,
                    properties: {
                      bb: { type: 'number' },
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

    describe('anyOf', () => {
      it('ignores combinator schemas', () => {
        const schema = {
          type: 'object',
          properties: {
            anyOfProperty: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    a: {
                      type: 'object',
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    b: {
                      type: 'object',
                      properties: {
                        bb: { type: 'number' },
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
            anyOfProperty: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    a: {
                      type: 'object',
                      // additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    b: {
                      type: 'object',
                      // additionalProperties: false,
                      properties: {
                        bb: { type: 'number' },
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

    describe('oneOf', () => {
      it('ignores combinator schemas', () => {
        const schema = {
          type: 'object',
          properties: {
            oneOfProperty: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    a: {
                      type: 'object',
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    b: {
                      type: 'object',
                      properties: {
                        bb: { type: 'number' },
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
            oneOfProperty: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    a: {
                      type: 'object',
                      // additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    b: {
                      type: 'object',
                      // additionalProperties: false,
                      properties: {
                        bb: { type: 'number' },
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

    describe('not', () => {
      it('ignores combinator schemas', () => {
        const schema = {
          type: 'object',
          properties: {
            notProperty: {
              not: {
                type: 'object',
                properties: {
                  a: {
                    type: 'object',
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
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
            notProperty: {
              not: {
                type: 'object',
                properties: {
                  a: {
                    type: 'object',
                    // additionalProperties: false,
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
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
