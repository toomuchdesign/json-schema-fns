import { describe, expect, it } from 'vitest';

import { groupPathsByHead } from '../../src/utils/groupPathsByHead';

describe('Internal utilities', () => {
  describe('groupPathsByHead', () => {
    describe('bare paths', () => {
      it('collects single-segment paths into the bare set', () => {
        expect(groupPathsByHead(['a', 'b'])).toEqual({
          bare: new Set(['a', 'b']),
          nested: {},
        });
      });
    });

    describe('nested paths', () => {
      it('groups multi-segment paths by their first segment, stripped', () => {
        expect(groupPathsByHead(['b.c', 'b.d', 'e.f.g'])).toEqual({
          bare: new Set(),
          nested: { b: ['c', 'd'], e: ['f.g'] },
        });
      });

      it('preserves remaining dots in segments beyond the first', () => {
        expect(groupPathsByHead(['a.b.c.d'])).toEqual({
          bare: new Set(),
          nested: { a: ['b.c.d'] },
        });
      });
    });

    describe('mixed paths', () => {
      it('splits a mix of bare and nested paths', () => {
        expect(groupPathsByHead(['a', 'b.c', 'b.d', 'e.f.g'])).toEqual({
          bare: new Set(['a']),
          nested: { b: ['c', 'd'], e: ['f.g'] },
        });
      });

      it('records a key in both buckets when it appears as bare and nested', () => {
        expect(groupPathsByHead(['a', 'a.x'])).toEqual({
          bare: new Set(['a']),
          nested: { a: ['x'] },
        });
      });
    });

    describe('edge cases', () => {
      it('returns empty buckets for an empty input', () => {
        expect(groupPathsByHead([])).toEqual({
          bare: new Set(),
          nested: {},
        });
      });
    });
  });
});
