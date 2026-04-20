import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';

import { sealSchemaDeep } from '../src';

describe('sealSchemaDeep', () => {
  describe('combinators', () => {
    describe('allOf', () => {
      describe('root combinator', () => {
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

          const actual = sealSchemaDeep(schema);
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

      describe('object property combinator', () => {
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
      describe('root combinator', () => {
        it('seals each option', () => {
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

          const actual = sealSchemaDeep(schema);
          const expected = {
            anyOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('object property combinator', () => {
        it('seals each option', () => {
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
      describe('root combinator', () => {
        it('seals each option', () => {
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

          const actual = sealSchemaDeep(schema);
          const expected = {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: { a: { type: 'string' } },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: { b: { type: 'number' } },
              },
            ],
          } as const;

          expect(actual).toEqual(expected);
          expectTypeOf(actual).toEqualTypeOf(expected);
        });
      });

      describe('object property combinator', () => {
        it('seals each option', () => {
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
      describe('root combinator', () => {
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

      describe('object property combinator', () => {
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
            allOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            anyOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            oneOf: {
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
            allOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            anyOf: {
              type: 'object',
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            oneOf: {
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
            allOf: {
              type: 'object',
              // Property-named combinator: recurse normally (not a combinator at this position).
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            anyOf: {
              type: 'object',
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            oneOf: {
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
              // Property-named combinator: recurse normally (not a combinator at this position).
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
          },
          patternProperties: {
            allOf: {
              type: 'object',
              // Property-named combinator: recurse normally (not a combinator at this position).
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            anyOf: {
              type: 'object',
              additionalProperties: false,
              properties: {
                a: {
                  type: 'string',
                },
              },
            },
            oneOf: {
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
              // Property-named combinator: recurse normally (not a combinator at this position).
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
});
