import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { MergeTuples, TupleToUnion } from '../../src/utils/types';

describe('Internal types', () => {
  describe('MergeTuples', () => {
    it('merges and dedupes 2 tuples', () => {
      type Actual = MergeTuples<['a', 'b', 'c'], ['c', 'e', 'd']>;
      type Expected = ['a', 'b', 'c', 'd', 'e'];

      // TypeScript doesn't guarantee union sorting
      type ActualAsUnion = TupleToUnion<Actual>;
      type ExpectedAsUnion = TupleToUnion<Expected>;

      expectTypeOf<ActualAsUnion>().toEqualTypeOf<ExpectedAsUnion>();
    });
  });
});
