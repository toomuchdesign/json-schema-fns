import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { UnionToIntersection } from '../../src/utils/types';

describe('Internal types', () => {
  describe('UnionToIntersection', () => {
    it('transforms union to intersection', () => {
      type Actual = UnionToIntersection<{ a: string } | { b: number }>;
      type Expected = { a: string } & { b: number };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('transforms union to intersection', () => {
      type Actual = UnionToIntersection<
        { a: string } | { b: number } | { a: () => void }
      >;
      type Expected = { a: string } & { b: number } & { a: () => void };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });
  });
});
