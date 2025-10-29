import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeUnsealSchemaDeep, unsealSchemaDeep } from '../src';

describe('unsealSchemaDeep', () => {
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

  describe('combinators', () => {
    describe('allOf', () => {
      it('ignores combinator schemas', () => {});
      const schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
          allOfProperty: {
            allOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  a: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
                },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  b: {
                    type: 'object',
                    additionalProperties: false,
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

      const actual = unsealSchemaDeep(schema);
      const expected = {
        type: 'object',
        properties: {
          allOfProperty: {
            allOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  a: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      aa: { type: 'string' },
                    },
                  },
                },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  b: {
                    type: 'object',
                    additionalProperties: false,
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
          additionalProperties: false,
          properties: {
            anyOfProperty: {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    a: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    b: {
                      type: 'object',
                      additionalProperties: false,
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

        const actual = unsealSchemaDeep(schema);
        const expected = {
          type: 'object',
          properties: {
            anyOfProperty: {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    a: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    b: {
                      type: 'object',
                      additionalProperties: false,
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
          additionalProperties: false,
          properties: {
            oneOfProperty: {
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    a: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    b: {
                      type: 'object',
                      additionalProperties: false,
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

        const actual = unsealSchemaDeep(schema);
        const expected = {
          type: 'object',
          properties: {
            oneOfProperty: {
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    a: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        aa: { type: 'string' },
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    b: {
                      type: 'object',
                      additionalProperties: false,
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
          additionalProperties: false,
          properties: {
            notProperty: {
              not: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  a: {
                    type: 'object',
                    additionalProperties: false,
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

        const actual = unsealSchemaDeep(schema);
        const expected = {
          type: 'object',
          properties: {
            notProperty: {
              not: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  a: {
                    type: 'object',
                    additionalProperties: false,
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

    describe('JSON Schema object with JSON schema combinator prop names', () => {
      it.fails('changes object properties', () => {
        const schema = {
          type: 'object',
          additionalProperties: false,
          properties: {
            anyOf: {
              type: 'object',
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            not: {
              type: 'object',
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
          },
        } as const;
        deepFreeze(schema);

        const actual = unsealSchemaDeep(schema);
        const expected = {
          type: 'object',
          properties: {
            anyOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            /**
             * Currently, we don’t specifically distinguish between "not" used as an object property
             * and "not" used as a JSON Schema combinator.
             */
            not: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
          },
        } as const;

        expect(actual).toEqual(expected);
        // @ts-expect-error
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
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
