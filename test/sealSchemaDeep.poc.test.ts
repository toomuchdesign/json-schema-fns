import Ajv from 'ajv';
import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { FromSchema } from 'json-schema-to-ts';
import { describe, expect, it } from 'vitest';

const ajv = new Ajv();

describe('sealSchemaDeep', () => {
  describe('POC', () => {
    describe('anyOf', () => {
      describe('drop additionalProperties into items schemas', () => {
        describe('root combinator', () => {
          it('seals resulting type', () => {
            const schema = {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                  },
                },
              ],
            } as const;
            deepFreeze(schema);

            const validate = ajv.compile(schema);

            expect(
              validate({
                id: 2,
              }),
            ).toBe(true);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
              }),
            ).toBe(false);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | {
                  id?: number | undefined;
                }
              | {
                  name: string;
                };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });

        describe('root combinator with type object', () => {
          it('seals resulting type', () => {
            const schema = {
              type: 'object',
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                  },
                },
              ],
            } as const;
            deepFreeze(schema);

            const validate = ajv.compile(schema);

            expect(
              validate({
                id: 2,
              }),
            ).toBe(true);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
              }),
            ).toBe(false);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | {
                  id?: number | undefined;
                }
              | {
                  name: string;
                };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });
      });
    });

    describe('oneOf', () => {
      describe('additionalProperties', () => {
        describe('root combinator', () => {
          it('seals resulting type', () => {
            const schema = {
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                  },
                },
              ],
            } as const;
            deepFreeze(schema);

            const validate = ajv.compile(schema);

            expect(
              validate({
                id: 2,
              }),
            ).toBe(true);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
              }),
            ).toBe(false);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | {
                  id?: number | undefined;
                }
              | {
                  name: string;
                };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });

        describe('root combinator with type object', () => {
          it('seals resulting type', () => {
            const schema = {
              type: 'object',
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                  },
                },
              ],
            } as const;
            deepFreeze(schema);

            const validate = ajv.compile(schema);

            expect(
              validate({
                id: 2,
              }),
            ).toBe(true);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
              }),
            ).toBe(false);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | {
                  id?: number | undefined;
                }
              | {
                  name: string;
                };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });
      });
    });
  });
});
