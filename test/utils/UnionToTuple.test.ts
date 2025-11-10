import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { UnionToTuple } from '../../src/utils/types';

describe('Internal types', () => {
  describe('UnionToTuple', () => {
    it('tranforms union to tuple', () => {
      type Actual = UnionToTuple<'a' | 'b' | 'c'>;
      type Expected = ['a', 'b', 'c'];

      expectTypeOf<Actual>().toBeArray();
      expectTypeOf<Actual[number]>().toEqualTypeOf<Expected[number]>();
    });

    it('tranforms union to tuple', () => {
      type Actual = UnionToTuple<1 | 2 | 3>;
      type Expected = [1, 2, 3];

      expectTypeOf<Actual>().toBeArray();
      expectTypeOf<Actual[number]>().toEqualTypeOf<Expected[number]>();
    });

    it('tranforms union to tuple', () => {
      type Actual = UnionToTuple<boolean | 1>;
      type Expected = [1, false, true];

      expectTypeOf<Actual>().toBeArray();
      expectTypeOf<Actual[number]>().toEqualTypeOf<Expected[number]>();
    });
  });
});
