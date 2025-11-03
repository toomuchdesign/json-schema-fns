import deepFreeze from 'deep-freeze';
import { expectTypeOf } from 'expect-type';
import type { FromSchema } from 'json-schema-to-ts';
import { describe, expect, it } from 'vitest';

describe('sealSchemaDeep', () => {
  describe('integration', () => {
    describe('unevaluatedProperties + FromSchema', () => {
      it('seals resulting type', () => {
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
          unevaluatedProperties: false,
        } as const;
        deepFreeze(schema);

        type Actual = FromSchema<typeof schema>;
        type Expected = {
          id?: number | undefined;
          name: string;
        };

        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });
  });
});
