import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type {
  DeepPaths,
  FirstSegment,
  HasPathStartingWith,
  SubPathsFor,
  TopLevelKeys,
} from '../src/pickPropsDeep/types';
import type { TupleToUnion } from '../src/utils/types';

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
          HasPathStartingWith<readonly ['a', 'b.x'], 'a'>
        >().toEqualTypeOf<true>();
      });
    });

    describe('the key is the prefix of a dot-notation path', () => {
      it('returns true', () => {
        expectTypeOf<
          HasPathStartingWith<readonly ['a.x', 'b'], 'a'>
        >().toEqualTypeOf<true>();
      });
    });

    describe('no path references the key', () => {
      it('returns false', () => {
        expectTypeOf<
          HasPathStartingWith<readonly ['a.x', 'b'], 'c'>
        >().toEqualTypeOf<false>();
      });
    });

    describe('an empty paths tuple', () => {
      it('returns false', () => {
        expectTypeOf<
          HasPathStartingWith<readonly [], 'a'>
        >().toEqualTypeOf<false>();
      });
    });

    describe('the key is a prefix substring without a dot boundary', () => {
      it('returns false', () => {
        expectTypeOf<
          HasPathStartingWith<readonly ['ab'], 'a'>
        >().toEqualTypeOf<false>();
      });
    });
  });

  describe('SubPathsFor', () => {
    describe('paths prefixed by the key', () => {
      it('returns the rest segments as a tuple', () => {
        type Actual = SubPathsFor<readonly ['a.x', 'a.y.z', 'b'], 'a'>;
        type Expected = readonly ['x', 'y.z'];
        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });

    describe('paths include an exact match', () => {
      it('skips exact-key matches', () => {
        type Actual = SubPathsFor<readonly ['a', 'a.x'], 'a'>;
        type Expected = readonly ['x'];
        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });

    describe('no paths match the prefix', () => {
      it('returns an empty tuple', () => {
        type Actual = SubPathsFor<readonly ['a', 'b.x'], 'c'>;
        type Expected = readonly [];
        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });

    describe('deeply nested paths', () => {
      it('preserves deep dot segments in the rest string', () => {
        type Actual = SubPathsFor<readonly ['a.b.c.d'], 'a'>;
        type Expected = readonly ['b.c.d'];
        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });
  });

  describe('FirstSegment', () => {
    describe('a dotted string', () => {
      it('returns the prefix before the first dot', () => {
        expectTypeOf<FirstSegment<'a.x'>>().toEqualTypeOf<'a'>();
      });
    });

    describe('a deeply dotted string', () => {
      it('strips only the first segment', () => {
        expectTypeOf<FirstSegment<'a.b.c'>>().toEqualTypeOf<'a'>();
      });
    });

    describe('there is no dot', () => {
      it('returns the string unchanged', () => {
        expectTypeOf<FirstSegment<'b'>>().toEqualTypeOf<'b'>();
      });
    });

    describe('a union input', () => {
      it('distributes over each member', () => {
        expectTypeOf<FirstSegment<'a.x' | 'b'>>().toEqualTypeOf<'a' | 'b'>();
      });
    });

    describe('never', () => {
      it('returns never', () => {
        expectTypeOf<FirstSegment<never>>().toEqualTypeOf<never>();
      });
    });
  });

  describe('TopLevelKeys', () => {
    describe('a mixed tuple of dotted and bare paths', () => {
      it('collects the first segment of every path', () => {
        type Actual = TopLevelKeys<readonly ['a.x', 'a.y', 'b', 'c.z']>;
        type Expected = 'a' | 'b' | 'c';

        // TypeScript does not guarantee union member ordering
        expectTypeOf<Actual>().toEqualTypeOf<Expected>();
      });
    });

    describe('tuple of bare keys', () => {
      it('returns them unchanged', () => {
        expectTypeOf<TopLevelKeys<readonly ['a', 'b']>>().toEqualTypeOf<
          'a' | 'b'
        >();
      });
    });

    describe('empty paths tuple', () => {
      it('returns never', () => {
        expectTypeOf<TopLevelKeys<readonly []>>().toEqualTypeOf<never>();
      });
    });

    describe('multiple paths share the same first segment', () => {
      it('deduplicates via union semantics', () => {
        type Actual = TopLevelKeys<readonly ['a.x', 'a.y', 'a']>;
        type ActualAsUnion = TupleToUnion<[Actual]>;
        expectTypeOf<ActualAsUnion>().toEqualTypeOf<'a'>();
      });
    });
  });
});
