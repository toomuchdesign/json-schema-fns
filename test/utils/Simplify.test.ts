import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { Simplify } from '../../src/utils/types';

describe('Internal types', () => {
  describe('Simplify', () => {
    it('flattens the output', () => {
      type PositionProps = {
        top: number;
        left: number;
      };

      type SizeProps = {
        width: number;
        height: number;
      };

      type Actual = Simplify<PositionProps & SizeProps>;
      type Expected = {
        top: number;
        left: number;
        width: number;
        height: number;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });

    it('preserves readonly attributes', () => {
      type PositionProps = {
        top: number;
        readonly left: number;
      };

      type SizeProps = {
        width: number;
        readonly height: number;
      };

      type Actual = Simplify<PositionProps & SizeProps>;
      type Expected = {
        top: number;
        readonly left: number;
        width: number;
        readonly height: number;
      };

      expectTypeOf<Actual>().toEqualTypeOf<Expected>();
    });
  });
});
