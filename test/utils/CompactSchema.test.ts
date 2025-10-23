import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { CompactSchema } from '../../src/utils/types';

describe('Internal types', () => {
  describe('CompactSchema', () => {
    it('removes properties "undefined", "[]" and "readonly []" properties', () => {
      type Actual = CompactSchema<{
        readonly a: string;
        readonly b: [];
        readonly c: readonly [];
        readonly e?: readonly [];
        readonly d: undefined;
        readonly f?: {};
      }>;

      type Expected = {
        readonly a: string;
        readonly f?: {} | undefined;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('sets resulting properties as readonly', () => {
      type Actual = CompactSchema<{
        a: string;
        b?: string;
        c: number;
      }>;

      type Expected = {
        readonly a: string;
        readonly b?: string | undefined;
        readonly c: number;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });
  });
});
