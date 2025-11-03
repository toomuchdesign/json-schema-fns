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

  describe('combinators', () => {
    describe('allOf', () => {
      describe('as object property definition', () => {
        it('ignores combinator schemas', () => {
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
                ],
              },
            },
            patternProperties: {
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
                        properties: {
                          aa: { type: 'string' },
                        },
                      },
                    },
                  },
                ],
              },
            },
            patternProperties: {
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
                ],
              },
            },
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });
    });

    describe('anyOf', () => {
      describe('as object property definition', () => {
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

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });
    });

    describe('oneOf', () => {
      describe('as object property definition', () => {
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

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });
    });

    describe('not', () => {
      describe('as root definition', () => {
        it('ignores combinator schemas', () => {
          const schema = {
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
              patternProperties: {
                a: {
                  type: 'object',
                  properties: {
                    aa: { type: 'string' },
                  },
                },
              },
            },
          } as const;
          deepFreeze(schema);

          const actual = sealSchemaDeep(schema);
          const expected = {
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
              patternProperties: {
                a: {
                  type: 'object',
                  properties: {
                    aa: { type: 'string' },
                  },
                },
              },
            },
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('as object property definition', () => {
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

    describe('JSON Schema object with JSON schema combinator prop names', () => {
      it('changes object properties', () => {
        const schema = {
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
            not: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
          },
          patternProperties: {
            anyOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
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
        deepFreeze(schema);

        const actual = sealSchemaDeep(schema);
        const expected = {
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
              // This is the reason why we need isObjectPropertiesDefinitionKeyword
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
          },
          patternProperties: {
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
              // This is the reason why we need isObjectPropertiesDefinitionKeyword
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
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
