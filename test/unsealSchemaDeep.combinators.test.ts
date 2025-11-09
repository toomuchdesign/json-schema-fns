import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { unsealSchemaDeep } from '../src';

describe('unsealSchemaDeep', () => {
  describe('combinators', () => {
    describe('allOf', () => {
      describe('as root definition', () => {
        it('ignores combinator schemas', () => {
          const schema = {
            allOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;
          deepFreeze(schema);

          const actual = unsealSchemaDeep(schema);
          const expected = {
            allOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('as object property definition', () => {
        it('ignores combinator schemas', () => {
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
            patternProperties: {
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
            patternProperties: {
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
      describe('as root definition', () => {
        it('ignores combinator schemas', () => {
          const schema = {
            anyOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;
          deepFreeze(schema);

          const actual = unsealSchemaDeep(schema);
          const expected = {
            anyOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('as object property definition', () => {
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
    });

    describe('oneOf', () => {
      describe('as root definition', () => {
        it('ignores combinator schemas', () => {
          const schema = {
            oneOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;
          deepFreeze(schema);

          const actual = unsealSchemaDeep(schema);
          const expected = {
            oneOf: [
              {
                type: 'object',
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('as object property definition', () => {
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
    });

    describe('not', () => {
      describe('as root definition', () => {
        it('ignores combinator schemas', () => {
          const schema = {
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
          } as const;
          deepFreeze(schema);

          const actual = unsealSchemaDeep(schema);
          const expected = {
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
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('as object property definition', () => {
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
    });

    describe('JSON Schema object with JSON schema combinator prop names', () => {
      it('changes object properties', () => {
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
            // This is the reason why we need isObjectPropertiesDefinitionKeyword
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
            // This is the reason why we need isObjectPropertiesDefinitionKeyword
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
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });
  });
});
