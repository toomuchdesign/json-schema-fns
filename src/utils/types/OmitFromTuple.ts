import type { StringTuple } from './definitions';

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
