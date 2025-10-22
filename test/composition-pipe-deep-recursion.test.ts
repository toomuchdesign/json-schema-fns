import { expectTypeOf } from 'expect-type';
import type { FromSchema } from 'json-schema-to-ts';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import { pipeMergeProps, pipeSealSchemaDeep } from '../src';
import { largeSchema } from './composition-pipe-deep-recursion-mock';

describe('composition', () => {
  describe('deep recursion + FromSchema', () => {
    it('returns expected schema and types and does not hit TS2589 error', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const actual = pipeWith(
        schema,
        pipeMergeProps({
          type: 'object',
          properties: {
            b: { type: 'string' },
          },
        }),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      const expected = {
        type: 'object',
        required: ['a'],
        additionalProperties: false,
        properties: {
          a: { type: 'string' },
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);

      // Infer types with FromSchema
      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toEqualTypeOf<{
        b?: string | undefined;
        a: string;
      }>();
    });
  });

  describe('deep recursion + big schema + FromSchema', () => {
    it('returns expected schema and types and does not hit TS2589 error', () => {
      const actual = pipeWith(
        largeSchema,
        pipeMergeProps({
          type: 'object',
          properties: {
            b: { type: 'string' },
          },
        }),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
        pipeSealSchemaDeep(),
      );

      // Infer types with FromSchema
      type ActualDefinition = FromSchema<typeof actual>;
      expectTypeOf<ActualDefinition>().toBeObject();
    });
  });
});
