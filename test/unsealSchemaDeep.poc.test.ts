import Ajv from 'ajv';
import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { FromSchema } from 'json-schema-to-ts';
import { describe, expect, it } from 'vitest';

const ajv = new Ajv();

describe('unsealSchemaDeep', () => {
  describe('POC', () => {
    describe('anyOf', () => {
      describe('drop additionalProperties into items schemas', () => {
        describe('root combinator', () => {
          it('unseals resulting type', () => {
            const schema = {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
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
                extra: true,
              }),
            ).toBe(true);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | { [x: string]: unknown; id?: number | undefined }
              | { [x: string]: unknown; name: string };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });

        describe('root combinator with type object', () => {
          it('unseals resulting type', () => {
            const schema = {
              type: 'object',
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
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
                extra: true,
              }),
            ).toBe(true);

            type Actual = FromSchema<typeof schema>;
            type Expected =
              | { [x: string]: unknown; id?: number | undefined }
              | { [x: string]: unknown; name: string };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });
      });
    });

    describe('allOf', () => {
      describe('drop additionalProperties into items schemas', () => {
        describe('root combinator', () => {
          it('unseals resulting type', () => {
            const schema = {
              allOf: [
                {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
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
            ).toBe(false);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
                extra: true,
              }),
            ).toBe(true);

            type Actual = FromSchema<typeof schema>;
            type Expected = {
              [x: string]: unknown;
              id?: number | undefined;
              name: string;
            };
            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });

        describe('root combinator with type object', () => {
          it('unseals resulting type', () => {
            const schema = {
              type: 'object',
              allOf: [
                {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                  },
                },
                {
                  type: 'object',
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
            ).toBe(false);

            expect(
              validate({
                name: 'name',
              }),
            ).toBe(true);

            expect(
              validate({
                id: 2,
                name: 'name',
                extra: true,
              }),
            ).toBe(true);

            type Actual = FromSchema<typeof schema>;
            type Expected = {
              [x: string]: unknown;
              id?: number | undefined;
              name: string;
            };

            expectTypeOf<Actual>().toEqualTypeOf<Expected>();
          });
        });
      });
    });
  });
});
