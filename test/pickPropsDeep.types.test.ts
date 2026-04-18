import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type {
  DeepPaths,
  HasPathStartingWith,
  SubPathsFor,
  TopLevelKeys,
} from '../src/pickPropsDeep/types';
import type { TupleToUnion } from '../src/utils/types';

describe('Internal types', () => {
  describe('DeepPaths', () => {
    it('returns a union of leaf keys for a flat schema', () => {
      type Schema = {
        type: 'object';
        properties: {
          a: { type: 'string' };
          b: { type: 'number' };
        };
      };
      expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<'a' | 'b'>();
    });

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

    it('drills through multiple levels of nesting', () => {
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
      expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<'a' | 'a.b' | 'a.b.c'>();
    });

    it('returns never for a schema without properties', () => {
      type Schema = { type: 'string' };
      expectTypeOf<DeepPaths<Schema>>().toEqualTypeOf<never>();
    });
  });

  describe('HasPathStartingWith', () => {
    it('is true when the key is an exact bare path', () => {
      expectTypeOf<
        HasPathStartingWith<readonly ['a', 'b.x'], 'a'>
      >().toEqualTypeOf<true>();
    });

    it('is true when the key is the prefix of a dot-notation path', () => {
      expectTypeOf<
        HasPathStartingWith<readonly ['a.x', 'b'], 'a'>
      >().toEqualTypeOf<true>();
    });

    it('is false when no path references the key', () => {
      expectTypeOf<
        HasPathStartingWith<readonly ['a.x', 'b'], 'c'>
      >().toEqualTypeOf<false>();
    });

    it('is false for an empty paths tuple', () => {
      expectTypeOf<
        HasPathStartingWith<readonly [], 'a'>
      >().toEqualTypeOf<false>();
    });

    it('does not match keys that are only a prefix substring (no dot boundary)', () => {
      expectTypeOf<
        HasPathStartingWith<readonly ['ab'], 'a'>
      >().toEqualTypeOf<false>();
    });
  });

  describe('SubPathsFor', () => {
    it('extracts the rest segment for paths prefixed by the key', () => {
      type Actual = SubPathsFor<readonly ['a.x', 'a.y.z', 'b'], 'a'>;
      type Expected = readonly ['x', 'y.z'];
      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('skips exact-key matches (they are handled by the whole-wins branch)', () => {
      type Actual = SubPathsFor<readonly ['a', 'a.x'], 'a'>;
      type Expected = readonly ['x'];
      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('returns an empty tuple when no paths match the prefix', () => {
      type Actual = SubPathsFor<readonly ['a', 'b.x'], 'c'>;
      type Expected = readonly [];
      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('preserves deep dot segments in the rest string', () => {
      type Actual = SubPathsFor<readonly ['a.b.c.d'], 'a'>;
      type Expected = readonly ['b.c.d'];
      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });
  });

  describe('TopLevelKeys', () => {
    it('collects the first segment of every path', () => {
      type Actual = TopLevelKeys<readonly ['a.x', 'a.y', 'b', 'c.z']>;
      type Expected = 'a' | 'b' | 'c';

      // TypeScript does not guarantee union member ordering
      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('returns bare keys unchanged', () => {
      expectTypeOf<TopLevelKeys<readonly ['a', 'b']>>().toEqualTypeOf<
        'a' | 'b'
      >();
    });

    it('returns never for an empty paths tuple', () => {
      expectTypeOf<TopLevelKeys<readonly []>>().toEqualTypeOf<never>();
    });

    it('deduplicates via union semantics', () => {
      type Actual = TopLevelKeys<readonly ['a.x', 'a.y', 'a']>;
      type ActualAsUnion = TupleToUnion<[Actual]>;
      expectTypeOf<ActualAsUnion>().toEqualTypeOf<'a'>();
    });
  });
});
