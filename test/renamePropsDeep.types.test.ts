import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type {
  BareRenamesOf,
  SubRenamesFor,
} from '../src/renamePropsDeep/types';

describe('Internal types', () => {
  describe('BareRenamesOf', () => {
    describe('a map of bare and dotted entries', () => {
      it('keeps only the bare entries', () => {
        expectTypeOf<
          BareRenamesOf<{
            readonly a: 'A';
            readonly 'b.x': 'X';
            readonly c: 'C';
          }>
        >().toEqualTypeOf<{ readonly a: 'A'; readonly c: 'C' }>();
      });
    });

    describe('a map of only dotted entries', () => {
      it('returns an empty record', () => {
        expectTypeOf<
          BareRenamesOf<{ readonly 'a.x': 'X'; readonly 'b.y': 'Y' }>
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        >().toEqualTypeOf<{}>();
      });
    });

    describe('an empty map', () => {
      it('returns an empty record', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        expectTypeOf<BareRenamesOf<{}>>().toEqualTypeOf<{}>();
      });
    });
  });

  describe('SubRenamesFor', () => {
    describe('entries targeting the requested key', () => {
      it('strips the prefix and keeps only matching entries', () => {
        expectTypeOf<
          SubRenamesFor<
            {
              readonly 'a.x': 'X';
              readonly 'a.y.z': 'Z';
              readonly b: 'B';
            },
            'a'
          >
        >().toEqualTypeOf<{
          readonly x: 'X';
          readonly 'y.z': 'Z';
        }>();
      });
    });

    describe('no entries target the requested key', () => {
      it('returns an empty record', () => {
        expectTypeOf<
          SubRenamesFor<{ readonly 'a.x': 'X' }, 'b'>
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        >().toEqualTypeOf<{}>();
      });
    });

    describe('only a bare entry matches the key', () => {
      it('returns an empty record (bare entries are not sub-paths)', () => {
        expectTypeOf<
          SubRenamesFor<{ readonly a: 'A' }, 'a'>
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        >().toEqualTypeOf<{}>();
      });
    });
  });
});
