import type { UnionToTuple } from './';
import type { StringTuple } from './definitions';

/**
 * Merge and dedupe 2 tuples
 */
export type MergeTuples<
  T1 extends StringTuple,
  T2 extends StringTuple,
> = UnionToTuple<
  // Transform tuples to union to remove duplicates
  T1[number] | T2[number]
>;
