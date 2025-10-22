import type { UnionToTuple } from 'type-fest';

type StringTuple = readonly string[];

/**
 * Produce a new tuple by removing specified entries from an existing tuple type
 */
export type OmitFromTuple<
  Tuple extends StringTuple | undefined,
  EntriesToOmit,
> = Tuple extends readonly [infer Head, ...infer Tail extends StringTuple]
  ? Head extends EntriesToOmit
    ? OmitFromTuple<Tail, EntriesToOmit>
    : readonly [Head, ...OmitFromTuple<Tail, EntriesToOmit>]
  : [];

/**
 * Produce a new tuple by picking specified entries from an existing tuple type
 */
export type PickFromTuple<
  Tuple extends StringTuple,
  EntriesToPick,
> = Tuple extends readonly [infer Head, ...infer Tail extends StringTuple]
  ? Head extends EntriesToPick
    ? readonly [Head, ...PickFromTuple<Tail, EntriesToPick>]
    : PickFromTuple<Tail, EntriesToPick>
  : readonly [];

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
    : [];
