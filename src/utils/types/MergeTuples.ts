import type { OmitFromTuple } from './OmitFromTuple';
import type { StringTuple } from './definitions';

/**
 * Merge and dedupe 2 tuples
 */
export type MergeTuples<
  T1 extends StringTuple,
  T2 extends StringTuple,
> = readonly [...T1, ...OmitFromTuple<T2, T1[number]>];
