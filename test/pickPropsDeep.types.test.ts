import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type {
  DeepPaths,
  FirstPathSegment,
  HasPathStartingWith,
  SubPathsFor,
} from '../src/pickPropsDeep/types';

describe('Internal types', () => {
  describe('DeepPaths', () => {
    describe('flat schema', () => {
      it('returns a union of all property keys', () => {
        type Schema = {
          type: 'object';
          properties: {
            a: { type: 'string' };
            b: { type: 'number' };
          };
        };
        expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<'a' | 'b'>();
      });
    });

    describe('schema with one level of nesting', () => {
      it('includes both the nested object key and its inner paths', () => {
        type Schema = {
          type: 'object';
          properties: {
            a: {
              type: 'object';
              properties: {
                x: { type: 'string' };
                y: { type: 'number' };
              };
            };
            b: { type: 'string' };
          };
        };
        expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<
          'a' | 'a.x' | 'a.y' | 'b'
        >();
      });
    });

    describe('schema with multiple levels of nesting', () => {
      it('includes all intermediate and leaf paths', () => {
        type Schema = {
          type: 'object';
          properties: {
            a: {
              type: 'object';
              properties: {
                b: {
                  type: 'object';
                  properties: {
                    c: { type: 'string' };
                  };
                };
              };
            };
          };
        };
        expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<
          'a' | 'a.b' | 'a.b.c'
        >();
      });
    });

    describe('a schema without properties', () => {
      it('returns never', () => {
        type Schema = { type: 'string' };
        expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<never>();
      });
    });
  });

  describe('HasPathStartingWith', () => {
    describe('the key matches exactly', () => {
      it('returns true', () => {
        expectTypeOf<
          HasPathStartingWith<'a' | 'b.x', 'a'>
        >().toEqualTypeOf<true>();
      });
    });

    describe('the key is the prefix of a dot-notation path', () => {
      it('returns true', () => {
        expectTypeOf<
          HasPathStartingWith<'a.x' | 'b', 'a'>
        >().toEqualTypeOf<true>();
      });
    });

    describe('no path references the key', () => {
      it('returns false', () => {
        expectTypeOf<
          HasPathStartingWith<'a.x' | 'b', 'c'>
        >().toEqualTypeOf<false>();
      });
    });

    describe('never (empty paths)', () => {
      it('returns false', () => {
        expectTypeOf<HasPathStartingWith<never, 'a'>>().toEqualTypeOf<false>();
      });
    });

    describe('the key is a prefix substring without a dot boundary', () => {
      it('returns false', () => {
        expectTypeOf<HasPathStartingWith<'ab', 'a'>>().toEqualTypeOf<false>();
      });
    });
  });

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

  describe('FirstPathSegment', () => {
    describe('a dotted string', () => {
      it('returns the prefix before the first dot', () => {
        expectTypeOf<FirstPathSegment<'a.x'>>().toEqualTypeOf<'a'>();
      });
    });

    describe('a deeply dotted string', () => {
      it('strips only the first segment', () => {
        expectTypeOf<FirstPathSegment<'a.b.c'>>().toEqualTypeOf<'a'>();
      });
    });

    describe('there is no dot', () => {
      it('returns the string unchanged', () => {
        expectTypeOf<FirstPathSegment<'b'>>().toEqualTypeOf<'b'>();
      });
    });

    describe('a union input', () => {
      it('distributes over each member', () => {
        expectTypeOf<FirstPathSegment<'a.x' | 'b'>>().toEqualTypeOf<
          'a' | 'b'
        >();
      });
    });

    describe('never', () => {
      it('returns never', () => {
        expectTypeOf<FirstPathSegment<never>>().toEqualTypeOf<never>();
      });
    });
  });
});
