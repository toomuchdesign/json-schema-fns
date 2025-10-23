import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { OmitByValue } from '../../src/utils/types';

describe('Internal types', () => {
  describe('OmitByValue', () => {
    it('removes properties fully included in provided Condition', () => {
      type Actual = OmitByValue<
        {
          a: string;
          b?: string;
          c: number;
          d: undefined;
        },
        string
      >;

      type Expected = {
        readonly b?: string | undefined;
        readonly c: number;
        readonly d: undefined;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('removes properties fully included in provided Condition', () => {
      type Actual = OmitByValue<
        {
          a: string;
          b?: string;
          c: number;
          d: undefined;
        },
        string | undefined
      >;

      type Expected = {
        readonly c: number;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });
  });
});
