import { pipe as effectPipe } from 'effect/Function';
import { expectTypeOf } from 'expect-type';
import { pipeWith } from 'pipe-ts';
import { pipe as remedaPipe } from 'remeda';
import { pipeInto } from 'ts-functional-pipe';
import { describe, expect, it } from 'vitest';

import {
  pipeMergeProps,
  pipeOmitProps,
  pipeRequireProps,
  pipeSealSchemaDeep,
} from '../src';

describe('composition', () => {
  describe('pipe packages interop', () => {
    describe('pipe-ts', () => {
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

    describe('ts-functional-pipe', () => {
      it('returns expected schema and types', () => {
        const schema = {
          type: 'object',
          required: ['a'],
          properties: {
            a: { type: 'string' },
          },
        } as const;

        const actual = pipeInto(
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

    describe('effect', () => {
      it('returns expected schema and types', () => {
        const schema = {
          type: 'object',
          required: ['a'],
          properties: {
            a: { type: 'string' },
          },
        } as const;

        const actual = effectPipe(
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

    describe('remeda', () => {
      it('returns expected schema and types', () => {
        const schema = {
          type: 'object',
          required: ['a'],
          properties: {
            a: { type: 'string' },
          },
        } as const;

        const actual = remedaPipe(
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
  });
});
