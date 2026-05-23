import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { SubPathsFor } from '../../src/utils/types';

describe('Internal types', () => {
  describe('SubPathsFor', () => {
    describe('paths prefixed by the key', () => {
      it('returns the rest segments as a union', () => {
        type Actual = SubPathsFor<'a.x' | 'a.y.z' | 'b', 'a'>;
        expectTypeOf<Actual>().toEqualTypeOf<'x' | 'y.z'>();
      });
    });

    describe('paths include an exact match', () => {
      it('skips exact-key matches', () => {
        type Actual = SubPathsFor<'a' | 'a.x', 'a'>;
        expectTypeOf<Actual>().toEqualTypeOf<'x'>();
      });
    });

    describe('no paths match the prefix', () => {
      it('returns never', () => {
        expectTypeOf<SubPathsFor<'a' | 'b.x', 'c'>>().toEqualTypeOf<never>();
      });
    });

    describe('deeply nested paths', () => {
      it('preserves deep dot segments in the rest string', () => {
        expectTypeOf<SubPathsFor<'a.b.c.d', 'a'>>().toEqualTypeOf<'b.c.d'>();
      });
    });
  });
});
