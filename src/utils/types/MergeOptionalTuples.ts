import type { StringTuple } from './definitions';
import type { MergeTuples } from './index';

/**
 * Merge and dedupe 2 optional tuples
 */
export type MergeOptionalTuples<
  T1 extends StringTuple | undefined,
  T2 extends StringTuple | undefined,
> = T1 extends StringTuple
  ? T2 extends StringTuple
    ? MergeTuples<T1, T2>
    : T1
  : T2 extends StringTuple
    ? T2
    : readonly [];
