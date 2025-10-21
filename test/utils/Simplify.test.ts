import { expectTypeOf } from 'expect-type';
import { describe, it } from 'vitest';

import type { Simplify } from '../../src/utils/types/records';

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
});
