import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { BareKeyPath } from '../src/omitPropsDeep/types';

describe('Internal types', () => {
  describe('BareKeyPath', () => {
    describe('a union of bare and dotted paths', () => {
      it('keeps only the bare keys', () => {
        expectTypeOf<BareKeyPath<'a' | 'b.x' | 'c'>>().toEqualTypeOf<
          'a' | 'c'
        >();
      });
    });

    describe('a union of only dotted paths', () => {
      it('returns never', () => {
        expectTypeOf<BareKeyPath<'a.x' | 'b.y'>>().toEqualTypeOf<never>();
      });
    });

    describe('a union of only bare paths', () => {
      it('returns the input unchanged', () => {
        expectTypeOf<BareKeyPath<'a' | 'b'>>().toEqualTypeOf<'a' | 'b'>();
      });
    });

    describe('never', () => {
      it('returns never', () => {
        expectTypeOf<BareKeyPath<never>>().toEqualTypeOf<never>();
      });
    });
  });
});
