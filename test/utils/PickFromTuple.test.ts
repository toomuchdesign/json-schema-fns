import { expectTypeOf } from 'expect-type';
import { TupleToUnion } from 'type-fest';
import { describe, it } from 'vitest';

import type { PickFromTuple } from '../../src/utils/types';

describe('Internal types', () => {
  describe('PickFromTuple', () => {
    it('picks provided values and ignores non existing ones', () => {
      type Actual = PickFromTuple<
        ['a', 'b', 'c', 'd', 'e'],
        'b' | 'e' | 'non-existing'
      >;
      type Expected = ['b', 'e'];

      // TypeScript doesn't guarantee union sorting
      type ActualAsUnion = TupleToUnion<Actual>;
      type ExpectedAsUnion = TupleToUnion<Expected>;

      expectTypeOf<ActualAsUnion>().toEqualTypeOf<ExpectedAsUnion>();
    });
  });
});
