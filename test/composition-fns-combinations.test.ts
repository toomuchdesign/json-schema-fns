import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { describe, expect, it } from 'vitest';

import {
  mergeProps,
  omitProps,
  pipeMergeProps,
  pipeOmitProps,
  pipeOptionalProps,
  pipePickProps,
  pipeRequireProps,
  pipeSealSchemaDeep,
  pipeUnsealSchemaDeep,
  requireProps,
  sealSchemaDeep,
} from '../src';

describe('composition', () => {
  describe('functional API', () => {
    it('returns expected schema and types', () => {
      const schema = {
        type: 'object',
        required: ['a'],
        properties: {
          a: { type: 'string' },
        },
      } as const;

      const actual = sealSchemaDeep(
        requireProps(
          omitProps(
            mergeProps(schema, {
              type: 'object',
              properties: {
                b: { type: 'string' },
              },
            }),
            ['a'],
          ),
          ['b'],
        ),
      );

      const expected = {
        type: 'object',
        required: ['b'],
        additionalProperties: false,
        properties: {
          b: { type: 'string' },
        },
      } as const;

      expect(actual).toEqual(expected);
      expectTypeOf(actual).toEqualTypeOf(expected);
    });
  });

  describe('pipeable API', () => {
    describe('case 1', () => {
      it('returns expected schema and types', () => {
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
          pipeOmitProps(['a']),
          pipeRequireProps(['b']),
          pipeSealSchemaDeep(),
        );

        const expected = {
          type: 'object',
          required: ['b'],
          additionalProperties: false,
          properties: {
            b: { type: 'string' },
          },
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });

    describe('case 2', () => {
      it('returns expected schema and types', () => {
        const schema = {
          type: 'object',
          required: ['a'],
          additionalProperties: true,
          properties: {
            a: { type: 'string' },
          },
        } as const;

        const actual = pipeWith(
          schema,
          pipeUnsealSchemaDeep(),
          pipeMergeProps({
            type: 'object',
            properties: {
              b: { type: 'string' },
            },
          }),
          pipeRequireProps(['b']),
        );

        const expected = {
          type: 'object',
          required: ['a', 'b'],
          properties: {
            a: { type: 'string' },
            b: { type: 'string' },
          },
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });

    describe('case 3', () => {
      it('returns expected schema and types', () => {
        const schema = {
          type: 'object',
          required: ['a'],
          additionalProperties: true,
          properties: {
            a: { type: 'string' },
          },
        } as const;

        const actual = pipeWith(
          schema,
          pipeUnsealSchemaDeep(),
          pipeMergeProps({
            type: 'object',
            required: ['b'],
            properties: {
              b: { type: 'string' },
            },
          }),
          pipePickProps(['a']),
          pipeOptionalProps(['a']),
        );

        const expected = {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        } as const;

        expect(actual).toEqual(expected);
        expectTypeOf(actual).toEqualTypeOf(expected);
      });
    });
  });
});
