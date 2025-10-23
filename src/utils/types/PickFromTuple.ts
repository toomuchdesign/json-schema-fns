import type { StringTuple } from './definitions';

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
