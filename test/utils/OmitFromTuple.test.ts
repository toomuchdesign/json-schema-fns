import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { OmitFromTuple, TupleToUnion } from '../../src/utils/types';

describe('Internal types', () => {
  describe('OmitFromTuple', () => {
    it('filter provided values', () => {
      type Actual = OmitFromTuple<['a', 'b', 'c', 'd', 'e'], 'b' | 'e'>;
      type Expected = ['a', 'c', 'd'];

      // TypeScript doesn't guarantee union sorting
      type ActualAsUnion = TupleToUnion<Actual>;
      type ExpectedAsUnion = TupleToUnion<Expected>;

      expectTypeOf<ActualAsUnion>().toEqualTypeOf<ExpectedAsUnion>();
    });
  });
});
