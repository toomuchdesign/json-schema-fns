import { pipe as effectPipe } from 'effect/Function';
import { expectTypeOf } from 'expect-type';
import type { FromSchema } from 'json-schema-to-ts';
import { pipeWith } from 'pipe-ts';
import { pipe as remedaPipe } from 'remeda';
import { pipeInto } from 'ts-functional-pipe';
import { describe, expect, it } from 'vitest';

import { pipeSealSchemaDeep } from '../../src';
import { assertValidSchema } from './../assertValidSchema';
import { largeSchema } from './composition-pipe-depth-ceiling-mock';

// Each library is tested at the deepest pipeline that still produces
// a usable inferred type when fed through `FromSchema`.
//
// 1. The library's own typed-overload cap (number of transformations,
//    excluding the initial data argument), measured from each library's `.d.ts`
//
// 2. The TS2589 recursion budget consumed by chaining `pipeSealSchemaDeep
//    and re-resolving the result through `FromSchema`.

const simpleSchema = {
  type: 'object',
  required: ['a'],
  properties: { a: { type: 'string' } },
} as const;

const simpleExpected = {
  type: 'object',
  required: ['a'],
  additionalProperties: false,
  properties: { a: { type: 'string' } },
} as const;

describe('composition / pipe depth ceiling', () => {
  describe('pipe-ts @ 9 transformations', () => {
    it('simple schema: type-checks, returns expected schema and types', () => {
      const actual = pipeWith(
        simpleSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      expect(actual).toEqual(simpleExpected);
      expectTypeOf(actual).toEqualTypeOf(simpleExpected);
      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toEqualTypeOf<{ a: string }>();
    });

    it('largeSchema: type-checks, returns a non-never object', () => {
      const actual = pipeWith(
        largeSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toBeObject();
    });
  });

  describe('remeda @ 15 transformations', () => {
    it('simple schema: type-checks, returns expected schema and types', () => {
      const actual = remedaPipe(
        simpleSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      expect(actual).toEqual(simpleExpected);
      expectTypeOf(actual).toEqualTypeOf(simpleExpected);
      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toEqualTypeOf<{ a: string }>();
    });

    it('largeSchema: type-checks, returns a non-never object', () => {
      const actual = remedaPipe(
        largeSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toBeObject();
    });
  });

  describe('effect @ 15 transformations', () => {
    it('simple schema: type-checks, returns expected schema and types', () => {
      const actual = effectPipe(
        simpleSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      expect(actual).toEqual(simpleExpected);
      expectTypeOf(actual).toEqualTypeOf(simpleExpected);
      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toEqualTypeOf<{ a: string }>();
    });

    it('largeSchema: type-checks, returns a non-never object', () => {
      const actual = effectPipe(
        largeSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toBeObject();
    });
  });

  describe('ts-functional-pipe @ 16 transformations', () => {
    it('simple schema: type-checks, returns expected schema and types', () => {
      const actual = pipeInto(
        simpleSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      expect(actual).toEqual(simpleExpected);
      expectTypeOf(actual).toEqualTypeOf(simpleExpected);
      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toEqualTypeOf<{ a: string }>();
    });

    it('largeSchema: type-checks, returns a non-never object', () => {
      const actual = pipeInto(
        largeSchema,
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      assertValidSchema(actual);

      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toBeObject();
    });
  });
});
